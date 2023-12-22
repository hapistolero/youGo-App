#YouGo-App-Api

##You can access the endpoint on this link

<a href="http://34.101.135.169">http://34.101.135.169<a>

API Usage
Endpoint
1. Endpoint /articles
Post /articles

Submit Article
Sent via multipart/form-data header
Body Payload: id (text), title (text), description (text), imageUrl (file), webUrl (text)
Get /articles

Get all articles
Get /articles/{id}

Get an article by ID
id is the ID of an article
Put /articles/{id}

Update article content
Sent via multipart/form-data header
id is the ID of an article
Body Payload: imageUrl (file), title (text), description (text), webUrl (text)
Delete /articles/{id}

Delete an article
id is the ID of an article
2. Endpoint /authentications
POST/authentications

Request access token
Sent via multipart/raw/JSON header
Body Payload: email (string), password (string)
PUT/authentications

Refresh access token
DELETE/authentications

Delete access token
2. Endpoint /authenticationsAdmin
POST/authentications

Request access token (admin)
Sent via multipart/raw/JSON header
Body Payload: email (string), password (string)
PUT/authentications

Refresh access token (admin)
DELETE/authentications

Delete access token (admin)
3. Endpoint /poses
POST/poses
-(admin)

Add yoga pose
Sent via multipart/form-data
Body Payload: id (string), title (string), imageUrl (file), category (string)
GET/poses

Display all yoga pose data
GET/poses/{id}

Display yoga pose data by ID
id is the ID of a pose
DELETE/poses/{id}
-(admin)

Delete yoga pose data by ID
id is the ID of a pose
PUT/poses/{id}
-(admin)

Update yoga pose data
Sent via multipart/form-data header
id is the ID of a pose
Body Payload: id (string), title (string), imageUrl (file), category (string)
3. Endpoint /poses/{poseId}/step
POST/poses/{poseId}/stepp
-(admin)

Add steps for a yoga pose
Sent via multipart/form-data
Body Payload: step (string), time (string), image (file)
DELETE/poses/{poseId}/step/{stepId}
-(admin)

Delete details (step) of a yoga pose based on poseId and stepId
PUT/poses/{id}/step/{stepId}
-(admin)

Update details (step) of a yoga pose based on poseId and stepId
Sent via multipart/form-data header
Body Payload: step (string), time (string), image (file)
4. Endpoint /profile
POST/profile

Add user profile data
Sent via application/JSON header
Body Payload: id (string), firstName (string), lastName (string), email (string), age (string), weight (string), height (string)
Requires user authentication
GET/profile

Display all user profile data
Requires user authentication
PUT/profile

Update user profile data
Sent via application/JSON header
Body Payload: id (string), firstName (string), lastName (string), email (string), age (string), weight (string), height (string)
Requires user authentication
5. Endpoint /schedule
POST/schedule

Add schedule data
Sent via application/JSON header
Body Payload: poseId (string array), scheduleName (string), dayTime (string)
Requires user authentication
Example:
json
Copy code
{
  "scheduleName": "sched123",
  "dayTime": "friday",
  "poseId": ["P001", "P003"]
}
GET/schedule

Display all schedule data
Requires user authentication
GET/schedule/{id}

Display all schedule data for a specific user based on ID
id is the ID of a schedule
Requires user authentication
DELETE/schedule/{id}

Delete schedule data for a specific user based on ID
id is the ID of a schedule
Requires user authentication
PUT/schedule/{id}

Update schedule data
Requires user authentication
6. Endpoint /users
POST/users

Register user account
Sent via JSON header
Body Payload: email (string), password (string)
6. Endpoint /yogaPlaceRecomendation
POST/yogaPlaceRecomendation

Get yoga place recommendations based on user location
Body Payload: latitude (string), longitude (string)
6. Endpoint /checkMyPose/{id}
POST/checkMyPose/{id}

Check if your yoga pose is correct
id is the pose to compare with
Body Payload: image (file)


