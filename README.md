# webAppProject
Course project for web applications course
Link to documentation  part where featuresand technology choices are listed:
https://docs.google.com/document/d/1usCOmlOnt1_2Xbz3S01Up1fJuk8NI_UN_eD5bi8CMME/edit?usp=sharing


Installation guidelines
  - install npm to your computer
  - clone the repository from github
  - open the clone repository in IDE (Visual studio code for example)
  - then run commands to install all necessarry modules
    -   npm run install
    -   npm run preinstall 
  - 2 choices of running the project
    - production mode
      - only one server running
      - need to run first
        - npm run build 
      -  then 
        - Windows
          - SET NODE_ENV=production& npm run dev:server
        - Other
          - NODE_ENV=production npm run dev:server
      - then go to http://localhost:1234 
    - development mode
      - individual servers for client and server
      - Command
        - Windows
          - SET NODE_ENV=development& npm run dev:server
        - Other
          - NODE_ENV=development npm run dev:server
        - and for both then run
          - npm run dev:client
    - if node not set then project can be run using
      - npm run dev:server
      - npm run dev:client
  - To test admin functionality
    - log in using
        - username: admin
        - password: Jess@1234


What the project is?
  - the project is an website where users can create posts, leave comments on posts and vote both comments and posts.
  - There is also a search feature where users can search posts by their title
  - users can also remove and edit their posts and comments and other users can see the last modified time and date
  - users can also see other users profiles when they press profile name from the post

How the project functions(user manual)
  - non-authenticated users(has not logged in)
      - can see posts
      - can see comments
      - can search post titles
      - can go to post user profile page when presses user
      - CANNOT
         - add votes
         - add posts
         - add comments
         - see own profile page(as not loggedf in)
  - authenticated users(has logged in)
    - can do same as non-authenticated user
    - but also CAN
       - add votes
       - add comments
       - add posts
       - see own profile page
       - log out
  - admin user(has logged in)
    - can do same as authenticated users
    - but also CAN
      - edit all other users comments and posts(editing contents, post titles and even removing them)
       
    





