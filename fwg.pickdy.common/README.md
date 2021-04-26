# tgn.common

# Adding tgn.common submodule to your repository:

1.  Before starting this make sure all team members have the committed their changes and have the latest code added to their repository.
2.  Delete tgn.common folder from your repository and push this change.
3.  After this is done get all your team to pull to the latest which will have the the tgn.common folder deleted. (If this step is not done and you get into an issue See Troubleshooting "Added by Them")
4.  Now that all the team's local repository doesn't have tgn.common folder. Go into your repository and run:

        git submodule add https://nguyenduyan90@bitbucket.org/pickdycore/tgn-pickdy-common.git

5.  The submodule is now added, but needs to be updated run:

        git submodule init
        git submodule update

6)  Add to your repository Circle CI build file(.circleci/config.yml) under steps:

        # GIT SUBMODULES
              - run: sed -i 's/https:\/\/bitbucket.org\/tgn/https:\/\/'${CIRCLE_GIT_NPM_CREDENTIALS}'@bitbucket.org\/tgn/g' ./.gitmodules
              - run: git submodule init
              - run: git submodule update

7)  Add Steps to your repository README.md so other Developers know how to deal with your sub modules.

        x. git submodule init
        x. git submodule update

# Updating tgn.common

Info: Now that you have tgn.common as a submodule in your repository, when you go into tgn.common folder you're actually going into the tgn.common repository. If you make a change to tgn.common you will need to push this change in both tgn.common repository and your repository. Your repository's tgn.common is always locked to a commit hash.

Scenario: In your repository you modify a file in tgn.common and want to commit this change in and also update your repository to also have this change.

Solution:

        cd tgn.common
        git add .
        git commit -m "Your commit message"
        git pull origin master
        git push origin HEAD:master
        # Now you need to update your project's repository that uses tgn.common, so that when other developers get our repository they're using the same version of tgn.common that you have just updated.
        cd ..
        git add .
        git commit -m "Updated tgn.common to branch latest version"
        git push

# To update to latest version

Scenario: The tgn.common branch has been updated not like above(Updating tgn.common), but done outside of your repository, For example one of the other teams has updated tgn.common branch. You want your project's repository to also get that update.

Solution:

        cd tgn.common
        git pull origin master
        # Now you need to update your project's repository that uses tgn.common, so that when other developers get our repository they're using the same version of tgn.common that you have just updated.
        cd ..
        git add .
        git commit -m "Updated tgn.common to branch latest version"
        git push

# Troubleshooting

### Added by Them:

If you get in red that tgn.common says "Added By Them" It is because they have the old folder in their local repository so it sees it as a conflict. I haven't found a way to deal with this, other than recloning your projects repository or commiting the changes in which will mess up your tgn.common folder then after going back and removing the module and adding it back in again.

### tgn.common "head detached from master":

THIS IS NORMAL and is the expected behavour, but can be tricky to deal with if you don't know how. You can't simple do a git push. because your not on a branch, you're on a commit level of master. It is because your repository is locked to a commit level of tgn.common and it is detached from the branch this is what is expected. What you need to do is whenever you make a change is merge your tgn.common local HEAD back to your master. This can be done by going into tgn.common/ and running:

    git push origin HEAD:master
