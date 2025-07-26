# ToDo List Typescript Firebase

This is a single-page, 'Todo list application' that uses Google Firestore to store the User's Todo list.

The design is a 'Mobile First' responsive design that also support Tablet's and Desktop's. Breakpoints have been set at 650px for Tablet's & Small Desktop's, and 1024px for Medium & Large Desktop's.  
  
The site uses HTML5, CSS & TypeScript and the following functionality is supported (apart from displaying the Todo list):
1. Add a new Todo item.
2. Delete a new Todo item.
3. Update a Todo item (by clicking on the Todo text).
4. Mark Todo item as done.
5. Clearing the while Todo list.
6. Simple authentication with E-mail & password.
7. The Todo items are timestamped and the Todo list is sorted by creation time in descending order (i.e. the newest todo first).

Effort has been made making the application as user friendly as possible, where buttons are disabled for each application state (i.e. logged-in, logged-out) to prevent the user from making an invalid choice.

The following performance optimization has been implemented:
1. The Todo list is read in smaller chunks when the User login to improve 'the user's perceived load time'.
2. Only the affected item is re-rendered in the Todo list when a Todo item is added, updated & deleted.
  
A 'twin project site' has been published on GitHub pages (since I don't have credentials to change the settings on the original site):    
[https://chas-henrik.github.io/ToDo-List-Typescript-Firebase/](https://chas-henrik.github.io/ToDo-List-Typescript-Firebase/)
  

***
*Known problems:*
1. The authentication is the simplest possible where the User Credentials only contains E-mail Address & Password, and there is also no support for changing the Password after the User Account has been created.
2. The Todo list is only read once from the database (at User Login), and no effort has been made to keep the local content synchronized with the data base after that. So the local data might not reflect what is in the data base at any point of time (if the data is updated simultaneously on multiple devices). This scenario seems very unlikely though, and is left as a potential future improvement (if needed).
  
*Notes:*
1. Firebase creates the Todo Id to assure that each Todo Id is unique (even when the same user accesses the database simultaneously from two or more devices).
2. The Firebase API Key has been stored as an environment variable both on the local machine and on GitHub when deploying the 'twin project site'.
  
***