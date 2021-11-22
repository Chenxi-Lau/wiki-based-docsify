#!/usr/bin/env sh

# bash deploy.sh [info]

# process the input
commitType=$1
commitInfo=$2

# fix feat docs init 
emjoArray=(":bug:fix" ":sparkles:feat" ":pencil:docs" ":tada:init" )
if [ $commitType == "fix" ]
then 
  commitType=${emjoArray[0]}
elif [ $commitType == "feat" ]
then 
  commitType=${emjoArray[1]}
elif [ $commitType == "docs" ]
then 
  commitType=${emjoArray[2]}
elif [ $commitType == "init" ]
then 
  commitType=${emjoArray[3]}
else
  echo "no emjoArray"
fi

commit="$commitType: $commitInfo"

echo $commit

git add .
git commit -m "$commit"
git push

echo "start build"

set -e

echo "npm run docs:build"
npm run docs:build

cd docs/.vuepress/dist
 
echo "cd docs/.vuepress/dist"

git init
git add -A
git commit -m ':pencil:update：deploy'

echo "git push -f git@github.com:lcxcsy/blog.git master:gh-pages"
git push -f git@github.com:lcxcsy/blog.git master:gh-pages

echo "build finish"

cd ../

rm -rf dist