# XATA-Advanced-Fullstack

Welcome to the Teams Management System! This README provides guidelines on how  the on how different endpoints and the components of these project works.
The system is built on:

- 1.**Express Typescript for backend**
- 2.**Jest Library For Testing**
- 3.**HTML for the front-end**
- 4.**Xata database**

These system allows user to create and manage their own teams. Also a team lead can create projects and invite members to participate on the projects. Different tasks are assigned to different users and tracks the progress of the tasks based on the *completion,pending or in-progress state*

## Table of Contents
- [User Authentication and Authorization](#user-authentication-and-authorization)
- [Api Tests.](#api-tests)
- [ user Interface and Results](#user-Interface-and-Results)
- [ user Interface and Results](#user-Interface-and-Results)
- [ Testing Results](#testing-tesults)

## User Authentication and Authorization
These project uses JWT-tokens to authenticate the users and also assign different roles to different users.These feature maximizes the security of the application

Test demostration

1. **user login:**
    On login the users are assigned a unique token which allows then to access and perform different activities on the system  for a given period of time

   **login test**
![Login api Test image](<backend/assets/user login.png>)

2. **User Authorization**
    Different users are assigned different  privellages based on their role. For Example the Admin  can view users and delete them but the  user cannot perform these task.
    **Assessing users as unAuthorized user**
    These task is preserved for only admin users hence other users cannot perform these role
![alt  unAuthorized user](<backend/assets/getting users as  UnAuthorized user.png>)

     **Assesing users as a authorized users**
     ![alt assesing users as an admin](<backend/assets/fetching users with Admin role.png>)

## Api Tests
 Used PostMan and Thunder Client  as the *Api End-point* testing tools.These was usefull to ensure that all the apis sent to the Front-end work as required.
 
 Here are some api Tests.
 For the api tests to pass the user must be Logged in first
  **Test for getting projects**
   ![alt text](<backend/assets/All projects.png>)
   **Test for Registering users**
    ![alt text](<backend/assets/register user.png>)
   **Test for getting teams**    
    ![alt text](<backend/assets/get teams.png>)





### user Interface and Results

   1. **Users Display on Admin dashboard:**
     ![alt text](<backend/assets/admin dashboard.png>)
   2. **Team Management Page:**
     ![alt text](<backend/assets/team page.png>)

   3. **User management page:**
     ![alt text](<backend/assets/manage users.png>)

## Acknowledgements

- [Urbanus Wambua](https://github.com/urbanus-dev)
- [Billy Joseph](https://github.com/billyjoseph1)
- [Joy Kariuki](https://github.com/Nyakiojoy)
- [Jotham Micheni](https://github.com/jothammicheni)
- [Ridge Benson](https://github.com/ridgebenson/)
