#!/bin/sh
basedir=app/src/assets/help/
outputdir=`pwd`/html/${basedir}
echo ${outputdir}
cd ${basedir}
for f in *.md; do 
    echo "Transformation du fichier ${f} end ${outputdir}"`echo ${f} | sed s/md/html/g`
    showdown makehtml -i ${f} -o ${outputdir}`echo ${f} | sed s/md/html/g`
done
