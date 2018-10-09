define({ "api": [
  {
    "type": "post",
    "url": "/documents/:id/:field/comments",
    "title": "Create",
    "name": "createComment",
    "group": "Comments",
    "description": "<p>Creates a comment on a specific field of a document.</p>",
    "permission": [
      {
        "name": "authenticated",
        "title": "Must be authenticated",
        "description": "<p>User must be authenticated before accessing (Keycloak)</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "field",
            "description": "<p>(Body) The field of the document where the comment is being made</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "comment",
            "description": "<p>(Body) The field of the document where the comment is being made</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "POST body",
        "content": "{\n \"field\": \"authorName\",\n \"comment\": \"Nullam sit amet ipsum id metus porta rutrum in vel nibh. Sed efficitur quam urna, eget imperdiet libero ornare.\"\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Comments"
  },
  {
    "type": "get",
    "url": "/documents/:idDocument/comments",
    "title": "Get an array of comments",
    "name": "getSomeComments",
    "group": "Comments",
    "description": "<p>You can get an array of comments of a document, as long you provide the correct querystring. No querystring at all returns a BAD REQUEST error.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectID(s)",
            "optional": true,
            "field": "ids",
            "description": "<p>A list of ObjectIds, separated by comma. Ex: <code>ids=commentI21,commentId2,commentId3</code></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "field",
            "description": "<p>The name of the field that the comments belongs to</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Comments"
  },
  {
    "type": "post",
    "url": "/documents/:idDocument/comments/:idComment/resolve",
    "title": "Resolve a comment of a document",
    "name": "resolveComment",
    "group": "Comments",
    "description": "<p>Resolves a comment of a document. This only sets the value <code>resolved</code> of a comment</p> <p>The only one who can do this is the author of the document.</p>",
    "permission": [
      {
        "name": "accountable",
        "title": "Accountable members only",
        "description": "<p>User must be a member of the Accountable group (Keycloak)</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Comments"
  },
  {
    "type": "put",
    "url": "/documents/:idDocument/update/:field",
    "title": "Updates the content a field of a document",
    "name": "updateDocumentField",
    "group": "Comments",
    "description": "<p>Note: This is only intended when updating a state of a field after a comment was created and added to the text's state.</p> <p>The following should throw an error:</p> <ul> <li>The <code>:field</code> is not part of the content of the document.</li> <li>The <code>:field</code> is not commentable.</li> <li>The text is being changed.</li> <li>More than one mark is being added to the state.</li> <li>The one and only mark (the modification) needs to be a comment.</li> </ul> <p>Please note that any logged user can modify a field but knowing that this is for comments, the validators are used so you cannot mess around with this.</p>",
    "permission": [
      {
        "name": "authenticated",
        "title": "Must be authenticated",
        "description": "<p>User must be authenticated before accessing (Keycloak)</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "content",
            "description": "<p>(Body) The state of the text editor</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Comments"
  },
  {
    "type": "get",
    "url": "/community",
    "title": "Get the community",
    "description": "<p>Gets the settings of a community. If there is no community, it throws an error.</p>",
    "name": "getCommunity",
    "group": "Community",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the community.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "mainColor",
            "description": "<p>The color of the community.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "logo",
            "description": "<p>The logo of the community.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user who initialized the community.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "initialized",
            "description": "<p>If the community is ready..</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"firstname\": \"John\",\n  \"lastname\": \"Doe\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>The community have not been initialized'</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/community.js",
    "groupTitle": "Community"
  },
  {
    "type": "put",
    "url": "/community",
    "title": "Update the community",
    "permission": [
      {
        "name": "admin",
        "title": "User access only",
        "description": "<p>User must be an admin (Keycloak)</p>"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer JWT access token.</p>"
          }
        ]
      }
    },
    "description": "<p>Updates the information of a community.</p>",
    "name": "putCommunity",
    "group": "Community",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the community.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mainColor",
            "description": "<p>The color of the community.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "logo",
            "description": "<p>The logo of the community.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>The user who initialized the community.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "initialized",
            "description": "<p>If the community is ready..</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/community.js",
    "groupTitle": "Community"
  },
  {
    "type": "delete",
    "url": "/custom-form/:id",
    "title": "Delete",
    "description": "<p>Deletes a customForm. It's a soft delete. The versions will still be available.</p>",
    "name": "deleteCustomForm",
    "group": "CustomForm",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The customForm id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/customForm.js",
    "groupTitle": "CustomForm"
  },
  {
    "type": "get",
    "url": "/custom-Form/:id",
    "title": "Get",
    "description": "<p>Get the lastest version of a customForm</p>",
    "name": "getCustomForm",
    "group": "CustomForm",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The customForm id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/customForm.js",
    "groupTitle": "CustomForm"
  },
  {
    "type": "get",
    "url": "/custom-form",
    "title": "List",
    "description": "<p>Returns a list of available custom forms. Only brings the latests versions of the custom forms.</p>",
    "name": "getCustomForms",
    "group": "CustomForm",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "versions",
            "description": "<p>Query parameter. Optional. Retrieves all the versions of all the available document Types if <code>true</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/customForm.js",
    "groupTitle": "CustomForm"
  },
  {
    "type": "post",
    "url": "/custom-form",
    "title": "Create",
    "description": "<p>Creates a new customForm</p>",
    "name": "postCustomForm",
    "group": "CustomForm",
    "version": "0.0.0",
    "filename": "api/customForm.js",
    "groupTitle": "CustomForm"
  },
  {
    "type": "put",
    "url": "/custom-form/:id",
    "title": "Update",
    "description": "<p>Updates a customForm. A new version gets created and available for use.</p>",
    "name": "putCustomForm",
    "group": "CustomForm",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The customForm id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/customForm.js",
    "groupTitle": "CustomForm"
  },
  {
    "type": "delete",
    "url": "/documents/:id",
    "title": "Delete",
    "name": "deleteDocument",
    "group": "Document",
    "permission": [
      {
        "name": "accountable",
        "title": "Accountable members only",
        "description": "<p>User must be a member of the Accountable group (Keycloak)</p>"
      }
    ],
    "description": "<p>Deletes a document and returns the id of the removed document.</p>",
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Document"
  },
  {
    "type": "get",
    "url": "/documents/:id",
    "title": "Get",
    "name": "getDocument",
    "description": "<p>Returns the data of a document.</p>",
    "group": "Document",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Documents ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the document</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>The user id of the author.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "published",
            "description": "<p>State of the document. If <code>false</code> is a draft and should not be public.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "customForm",
            "description": "<p>Id of the custom form</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Date of creation</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Date of update</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "content",
            "description": "<p>Content of the document</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "content.title",
            "description": "<p>Title of the document</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "content.brief",
            "description": "<p>A brief of the document</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "content.fields",
            "description": "<p>The custom fields of the document, those were defined on the custom form.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Document"
  },
  {
    "type": "get",
    "url": "/documents",
    "title": "List",
    "name": "getDocuments",
    "description": "<p>Returns a paginated list of -published- documents</p>",
    "group": "Document",
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Document"
  },
  {
    "type": "get",
    "url": "/my-documents",
    "title": "List",
    "name": "getDocuments",
    "description": "<p>Returns a paginated list of the users documents. Lists all kind of documents, no matter the state.</p>",
    "group": "Document",
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Document"
  },
  {
    "type": "post",
    "url": "/documents",
    "title": "Create",
    "name": "postDocument",
    "description": "<p>Creates a document and returns the created document. The author is not required to be sent on the body. API sets the author by itself.</p>",
    "group": "Document",
    "permission": [
      {
        "name": "accountable",
        "title": "Accountable members only",
        "description": "<p>User must be a member of the Accountable group (Keycloak)</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Document"
  },
  {
    "type": "put",
    "url": "/documents/:id",
    "title": "Update",
    "name": "putDocument",
    "description": "<p>Modifies a document. You just need to send the changed fields. No need to send all the document.</p>",
    "group": "Document",
    "permission": [
      {
        "name": "accountable",
        "title": "Accountable members only",
        "description": "<p>User must be a member of the Accountable group (Keycloak)</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Documents ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/document.js",
    "groupTitle": "Document"
  },
  {
    "type": "delete",
    "url": "/users/:id",
    "title": "Delets a user",
    "name": "deleteUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/me",
    "title": "Get the info of the logged user",
    "name": "getMyInfo",
    "group": "User",
    "version": "0.0.0",
    "filename": "api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Gets a user",
    "name": "getUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "List users",
    "name": "getUsers",
    "group": "User",
    "version": "0.0.0",
    "filename": "api/user.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/users/:id",
    "title": "Updates users info",
    "name": "putUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/user.js",
    "groupTitle": "User"
  }
] });
