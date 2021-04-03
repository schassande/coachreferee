import { Coaching } from './../model/coaching';
import { CoachingService } from './CoachingService';
import { ToolService } from './ToolService';
import { map, flatMap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { AngularFirestore, Query } from '@angular/fire/firestore';

import { RefereeService } from './RefereeService';
import { Competition, RefereeRef } from '../model/competition';
import { RefereeLevel, Referee, getRefereeLevelValue } from '../model/user';
import { CompetitionRankingList, RankingGroup, RankingMethod, RankingNode } from '../model/ranking';
import { ResponseWithData } from './response';
import { AppSettingsService } from './AppSettingsService';
import { RemotePersistentDataService } from './RemotePersistentDataService';


@Injectable()
export class CompetitionRefereeRankingService extends RemotePersistentDataService<CompetitionRankingList> {

    constructor(
      appSettingsService: AppSettingsService,
      private coachingService: CoachingService,
      db: AngularFirestore,
      private refereeService: RefereeService,
      toastController: ToastController,
      private toolService: ToolService
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'competitionrefereeranking';
    }

    getPriority(): number {
        return 5;
    }

    public findCompetitionRefereeRanking(competitionId: string, coachId: string): Observable<ResponseWithData<CompetitionRankingList[]>> {
      console.log('findCompetitionRefereeRanking(', competitionId, coachId);
      return this.query(this.getCollectionRef()
        .where('competitionId', '==', competitionId)
        .where('coachId', '==', coachId), 'default');
    }

    private splitGroupAll(list: CompetitionRankingList, groupIdx: number) {
    // build new groups by creating a group for each the subgroup
    const newGroups: RankingGroup[] = list.groups[groupIdx].rankingTrees.map((rootNode: RankingNode, idx) => {
      return {
        groupName: (groupIdx + 1) + '.' + (idx + 1),
        ranked: true,
        rankingTrees: [ rootNode]
      } as RankingGroup;
    });

    this.replaceGroup(list, groupIdx, newGroups);
  }

  /** insert the new groups in replacement of the splitted one. */
  private replaceGroup(list: CompetitionRankingList, groupIdx: number, newGroups: RankingGroup[]) {
    list.groups = list.groups.slice(0, groupIdx)
      .concat(newGroups)
      .concat(list.groups.slice(groupIdx + 1, list.groups.length));
  }

  public initList(list: CompetitionRankingList, competition: Competition): Observable<CompetitionRankingList> {
    return this.loadReferees(competition.referees).pipe(
      map((id2referee: Map<string, Referee>) => {
        list.rankedReferees = competition.referees.filter(
          (ref) => this.filterReferee(list, id2referee.get(ref.refereeId)));
        if (list.method === 'A' || list.method === 'S') {
          // Get the referee level, then create a group by referee level
          this.createGroupForEachLevel(list, id2referee);

        } else if (list.method === 'M') {
          // create a group by referee
          list.groups = list.rankedReferees.map((ref) => {
              return {
                  groupName: ref.refereeShortName,
                  rankingTrees: [{
                      refereeId: ref.refereeId,
                      refereeShortName: ref.refereeShortName,
                      children: [],
                      ranked: true
                    }],
                  ranked: true
              };
          });

        }
        if (list.method !== 'A') {
          this.manualRanking(list);
          if (list.method === 'S') {
            list.method = 'M';
          }
        }
        return list;
      })
    );
  }

  public manualRanking(list: CompetitionRankingList) {
    if (list.ranked) {
      return;
    }
    let result: RefereeRef[] = [];
    list.groups.forEach((group: RankingGroup) => {
      this.toList(group).forEach((rankingRefs: RefereeRef[]) => {
        result = result.concat(rankingRefs);
      });
    });
    list.ranked = true;
    list.rankedReferees = result;
  }

  private filterReferee(list: CompetitionRankingList, ref: Referee): boolean {
    // filter by gender
    if ((list.gender === 'F' && ref.gender !== 'F')
        || (list.gender === 'M' && ref.gender !== 'M')) {
      return false;
    }
    // filter by referee category
    if ( (list.category === 'J' && ref.referee.refereeCategory !== 'JUNIOR')
      || (list.category === 'O' && ref.referee.refereeCategory !== 'OPEN')
      || (list.category === 'S' && ref.referee.refereeCategory !== 'SENIOR')
      || (list.category === 'JO' && ref.referee.refereeCategory !== 'OPEN' && ref.referee.refereeCategory !== 'JUNIOR')
      || (list.category === 'OS' && ref.referee.refereeCategory !== 'OPEN' && ref.referee.refereeCategory !== 'SENIOR')) {
      return false;
    }

    console.log('filterReferee true', ref.shortName, list.gender, ref.gender, list.category, ref.referee.refereeCategory);
    return true;
  }

  public loadReferees(referees: RefereeRef[]): Observable<Map<string, Referee>> {
    const id2referee: Map<string, Referee> = new Map<string, Referee>();
    return forkJoin(referees.map((ref) => {
        return this.refereeService.get(ref.refereeId).pipe(
          map(rref => id2referee.set(ref.refereeId, rref.data))
        );
      })).pipe(map(() => id2referee));
  }

  public loadCoachings(competitionId: string, referees: RefereeRef[]): Observable<Map<string, Coaching[]>> {
    const refereeId2coachings: Map<string, Coaching[]> = new Map<string, Coaching[]>();
    return forkJoin(referees.map((ref) => {
      // console.log('loadCoachings for ref', ref.refereeShortName);
      return this.coachingService.getCoachingByRefereeCompetition(ref.refereeId, competitionId).pipe(
        map(rcoachings => {
          console.log('loadCoachings for ref', ref.refereeId, rcoachings.data);
          refereeId2coachings.set(ref.refereeId, rcoachings.data);
        })
      );
    })).pipe(map(() => {
      console.log('loadCoachings after forkjoin');
      return refereeId2coachings;
    }));
  }

  private createGroupForEachLevel(list: CompetitionRankingList, id2referee: Map<string, Referee>) {
    const level2group: Map<RefereeLevel, RankingGroup> = new Map<RefereeLevel, RankingGroup>();
    list.rankedReferees.forEach((ref: RefereeRef) => {
      const refId = ref.refereeId;
      const level: RefereeLevel = id2referee.get(refId).referee.refereeLevel;
      let group: RankingGroup = level2group.get(level);
      if (!group) {
        group = {
          groupName: '' + level,
          ranked: false,
          rankingTrees: []
        };
        level2group.set(level, group);
      }
      group.rankingTrees.push({
        refereeId: ref.refereeId,
        refereeShortName: ref.refereeShortName,
        children: [],
        ranked: true
      });
    });
    // get groups and sort them by referee level
    list.groups = Array.from(level2group.values()).sort((g1: RankingGroup, g2: RankingGroup) => {
        const val1 = getRefereeLevelValue(g1.groupName);
        const val2 = getRefereeLevelValue(g2.groupName);
        if (val1 >= 0 && val2 >= 0) {
            return val2 - val1;
        } else {
            return - g1.groupName.localeCompare(g2.groupName);
        }
    });
    // Compute if each group is ranked
    list.groups.forEach((group) => {
        group.ranked = group.rankingTrees.length === 1 && group.rankingTrees[0].ranked;
    });
  }

  public toList(group: RankingGroup): RefereeRef[][] {
    // console.log('>>>>>>>>>> toList(' + group.groupName + ')');
    const result: RefereeRef[][] = [];
    if (group.rankingTrees) {
        group.rankingTrees.forEach((rootNode: RankingNode) => {
            const currentTrack: RefereeRef[] = [];
            currentTrack.push(this.toRefereeRef(rootNode));
            result.push(currentTrack);
            this.toListOver(rootNode, currentTrack, result);
        });
    }
    // console.log('<<<<<<<<<<< toList(' + group.groupName + ')', result);
    return result;
  }

  private toListOver(node: RankingNode, currentTrack: RefereeRef[], result: RefereeRef[][]) {
    // console.log('toListOver(' + node.refereeShortName + ')',node, currentTrack, result);
    if (node.children) {
        node.children.forEach((child, idx) => {
            if (idx === 0) {
                currentTrack.push(this.toRefereeRef(child));
                this.toListOver(child, currentTrack, result);
            } else {
                const newTrack = [this.toRefereeRef(node), this.toRefereeRef(child)];
                result.push(newTrack);
                this.toListOver(child, newTrack, result);
            }
        });
    }
  }

  private toRefereeRef(node: RankingNode): RefereeRef {
    return { refereeId: node.refereeId, refereeShortName: node.refereeShortName };
  }

  public launchNextRanking(list: CompetitionRankingList,
                           refereeComparator: RefereeComparator): Observable<StepResult<CompetitionRankingList>> {
    // console.log('launchNextRanking', list.id);
    // Check if the list is already ranked
    if (list.ranked) {
      console.log('launchNextRanking', list.id, 'already ranked');
      return of(new StepResult(list));
    }
    // Try to merge the groups already ranked
    this.mergeRankedGroups(list);
    // find the next ranking to do
    const groupToRankIdx = list.groups.findIndex((group, idx) => !group.ranked);
    if (groupToRankIdx >= 0) {
      return this.rankGroup(list.groups[groupToRankIdx], list, refereeComparator).pipe(
        map((stepResult) => StepResult.from(list, stepResult))
      );
    } else if (list.groups.length === 1 && list.groups[0].ranked) {
      // the list is ranked
      list.rankedReferees = this.toList(list.groups[0])[0];
      list.ranked = true;
    } else {
      // console.log('launchNextRanking', list.id, 'else');
    }
    return of(new StepResult(list));
  }

  private mergeRankedGroups(list: CompetitionRankingList) {
    let previousRankedGroupIdx = -2;
    list.groups.forEach((group, idx) => {
      if (group.ranked) {
        if (idx === (previousRankedGroupIdx + 1)) {
          this.mergeTwoGroups(list, previousRankedGroupIdx, idx);
        } else {
          previousRankedGroupIdx = idx;
        }
      }
    });
  }

  private mergeTwoGroups(list: CompetitionRankingList, groupIdx1: number, groupIdx2: number) {
    // console.log('Merge groups', list.groups[groupIdx1].groupName, list.groups[groupIdx2].groupName);
    // Inject root nodes from group2 into group1
    list.groups[groupIdx2].rankingTrees.forEach((rootNode2) => {
        list.groups[groupIdx1].rankingTrees.push(rootNode2);
    });
    // indicate the group 1 is no more ranked
    list.groups[groupIdx1].ranked = false;
    // merge group names
    list.groups[groupIdx1].groupName += '&' + list.groups[groupIdx2].groupName;
    // remove the group 2 from the group list
    list.groups.splice(groupIdx2, 1);
  }

  private rankGroup(group: RankingGroup,
                    list: CompetitionRankingList,
                    refereeComparator: RefereeComparator): Observable<StepResult<RankingGroup>> {
    // console.log('rankGroup(' + group.groupName + ')');
    if (group.ranked) {
      // console.log('rankGroup(' + group.groupName + ') already ranked');
      return of(new StepResult(group));
    }
    if (group.rankingTrees.length === 1 && group.rankingTrees[0].ranked) {
      // console.log('rankGroup(' + group.groupName + ') become ranked');
      group.ranked = true;
      return of(new StepResult(group));
    }
    const treeToRank: RankingNode = group.rankingTrees.find(tree => !tree.ranked);
    if (treeToRank) {
      // There is at least one root node which is not ranked
      return this.rankNode(treeToRank, list, refereeComparator).pipe(map((stepResult) => StepResult.from(group, stepResult)));
    } else {
      // all root nodes are ranked
      if (group.rankingTrees.length > 1) {
        // More than one root node. => Merge the two rankingNode by comparing 2 root nodes/referees
        return refereeComparator.askUserChoiseBetween2Referees(group.rankingTrees[0], group.rankingTrees[1], list).pipe(
          map((stepResult) => {
            const node1 = group.rankingTrees[0];
            const node2 = group.rankingTrees[1];
            if (stepResult.result === node1.refereeId) {
              // detach the tree of the node 2
              group.rankingTrees.splice(1, 1);
              // put the second into the first
              node1.children.push(node2);
              node1.ranked = false;
              node2.ranked = false;
              return new StepResult(group);
            } else if (stepResult.result === node2.refereeId) {
              // detach the tree of the node 1
              group.rankingTrees.splice(0, 1);
              // put the first into the second
              node2.children.push(node1);
              node1.ranked = false;
              node2.ranked = false;
              return new StepResult(group);
            } else {
              // console.log('rankGroup', node1.refereeShortName, node2.refereeShortName,
              //    'stop process', stepResult.result, node2.refereeId, node1.refereeId);
              return new StepResult(group, false, false);
            }
          })
        );
      } else {
        group.ranked = true;
      }
    }
    return of(new StepResult(group));
  }

  private last(node: RankingNode): RankingNode {
    let current = node;
    while (current && current.children && node.children.length === 1 && current.children[0]) {
      current = current.children[0];
    }
    return current;
  }

  private rankNode(node: RankingNode,
                   list: CompetitionRankingList,
                   refereeComparator: RefereeComparator): Observable<StepResult<RankingNode>> {
    // console.log('rankNode', node.refereeShortName);
    if (node.children.length === 0) {
      node.ranked = true;
      return of(new StepResult(node));

    } else if (node.children.length === 1) {
      // only one child => recurse call
      return this.rankNode(node.children[0], list, refereeComparator).pipe (
        map(() => {
          node.ranked = node.children[0].ranked;
          return new StepResult(node);
        })
      );

    } else {
      // there are several children => ask to the use to compare children
      return refereeComparator.askUserChoiseBetween2Referees(node.children[0], node.children[1], list).pipe(
        map((stepResult) => {
          const node1 = node.children[0];
          const node2 = node.children[1];
          if (stepResult.result === node1.refereeId) {
            // put the second into the first
            node.children.splice(1, 1);
            node1.ranked = false;
            node2.ranked = false;
            node1.children.push(node2);
            return new StepResult(node);
          } else if (stepResult.result === node2.refereeId) {
            // put the first into the second
            node.children.splice(0, 1);
            node1.ranked = false;
            node2.ranked = false;
            node2.children.push(node1);
            return new StepResult(node);
          } else {
            // console.log('rankNode', node1.refereeShortName, node2.refereeShortName,
            //  'stop process', stepResult.result, node2.refereeId, node1.refereeId);
            return new StepResult(node, false, false);
          }
        })
      );
    }
  }
}

export interface RefereeComparator {
  /**
   * Compare two referees in a competition for a ranking list
   * @param ref1 the referee 1
   * @param ref2 the referee 2
   * @param list the current ranking list
   * @return empty string means no choice, otherwise the identifier of the referee
   */
  askUserChoiseBetween2Referees(ref1: RefereeRef,
                                ref2: RefereeRef,
                                list: CompetitionRankingList): Observable<StepResult<string>>;
}
export class StepResult<T> {
  constructor(public result: T,
              public stepFinish = true,
              public continueProcess = true) {}

  static from<T>(result: T,
                 previousResult: StepResult<any>) {
    return new StepResult<T>(result, previousResult.stepFinish, previousResult.continueProcess);
  }
}
