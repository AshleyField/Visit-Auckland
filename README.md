# Visit Auckland Group Project

###### How to install node and work on files at home.

1. Determine that Node.js is installed by opening Terminal and typing `npm -v`
2. If Node.js is not installed follow this link to install [click here](https://nodejs.org/en/download/)
3. If Node.js is installed then in terminal use the command `cd` to go to the directory where you want the files located.
4. In Terminal type `git clone <repositry link>` then hit enter.
5. Once downloaded cd to the website directory.
6. In Terminal type `npm install`. This should install all the necessary packages.
7. To run the compiler type `gulp sass:watch`

# Branches

###### How to create a branch

1. Type `git branch <branch name>`
2. **Always checkout to branch using `git checkout <branch name>`**
3. Send branch to GitHub using `git push -u origin <branch name>`

###### To merge the branch back to the master branch

1. Checkout to master branch using `git checkout master`
2. Add branch using `git merge <branch name>`
3. Push the merged data to GitHub using `git push`

# Make sure that you are working on a branch!

###### How to use Git
Before you commit you need to add the files you have changed with `git add .`
Once changed files have been added you can use `git commit -m "MESSAGE"`

**Please only commit when you have finished for the day or completed a feature**

When applicable push the repositry to GitHub using `git push`

To update your files with pushed files use the command `git pull`

###### If you are unfamiliar with Git please speak to Ash or Holly before proceeding.
