import { test, expect } from "@playwright/test";
import { ApiClient } from '../api/ApiClient';

let client: ApiClient;

test.describe('@API', () => {
    test.beforeAll(async () => {
        client = ApiClient.unauthorized();
        const { headers } = await client.challenger.post();
        const token = headers["x-challenger"];
        client.options = { token };
        client.challenges.options = { token };

    });

    test("GET /challenges (200)", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let response = await client.challenges.get(headers);
        expect(response.status).toBe(200);
        expect(response.data.challenges.length).toBe(59);
    });

    test("GET /todos (200)", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let response = await client.challenges.getTodos(headers);
        expect(response.status).toBe(200);
        expect(response.data.todos.length).toBe(10);
    });

    test("GET /todo (404) not plural", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        const error = await client.challenges.getTodo(headers);
        expect(error.status).toBe(404);

    });

    test("GET /todos/{id} (200)", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let response = await client.challenges.getTodoById(headers, 1);
        expect(response.data.todos[0].title).toBe('scan paperwork');
        expect(response.status).toBe(200);
    });

    test("GET /todos/{id} (404)", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        const error = await client.challenges.getTodoById(headers, 121);
        expect(error.status).toBe(404);
    });

    test("GET /todos (200) ?filter", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        const done = {
            "title": "Test",
            "doneStatus": true,
            "description": ""
        };
        const notDone = {
            "title": "Test",
            "doneStatus": false,
            "description": ""
        };
        await client.challenges.postTodos(headers, done);
        await client.challenges.postTodos(headers, notDone);
        let response = await client.challenges.getTodos(headers, '?doneStatus=false');
        expect(response.data.todos.length).toBe(11);
        response = await client.challenges.getTodos(headers, '?doneStatus=true');
        expect(response.data.todos.length).toBe(1);

    });

    test("HEAD /todos (200)", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let response = await client.challenges.headTodos(headers);
        expect(response.status).toBe(200);
    });

    test("POST /todos (201)	", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test",
            "doneStatus": true,
            "description": ""
        };
        let response = await client.challenges.postTodos(headers, data);
        expect(response.status).toBe(201);
        expect(response.data.title).toBe("Test");
        expect(response.data.doneStatus).toBe(true);
        expect(response.data.id).toBeGreaterThan(0);
    });

    test("POST /todos (400) doneStatus", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test",
            "doneStatus": "test",
            "description": ""
        };
        const error = await client.challenges.postTodos(headers, data);
        expect(error.status).toBe(400);
    });

    test("POST /todos (400) title too long", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Testitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitlet",
            "doneStatus": true,
            "description": ""
        };
        const error = await client.challenges.postTodos(headers, data);
        expect(error.status).toBe(400);
    });

    test("POST /todos (400) description too long", async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test",
            "doneStatus": true,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut. Lorem Ipsum"
        };
        const error = await client.challenges.postTodos(headers, data);
        expect(error.status).toBe(400);

    });

    test("POST /todos (201) max out content", async ({ }) => {
        let longTitle = 'a'.repeat(50);
        let longDescription = 'a'.repeat(200);

        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": longTitle,
            "doneStatus": true,
            "description": longDescription,
        };
        let response = await client.challenges.postTodos(headers, data);
        expect(response.status).toBe(201);
    });

    test('Try using a long 5000 char string as the description or title text', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let longString = 'a'.repeat(5000);
        let data = {
            "title": longString,
            "doneStatus": true,
            "description": "This is a test description."
        };
        const error = await client.challenges.postTodos(headers, data);
        expect(error.status).toBe(413);

    });

    test('POST /todos (400) extra field', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test title",
            "doneStatus": true,
            "description": "This is a test description.",
            "chapter": "Ultramarine"
        };
        const error = await client.challenges.postTodos(headers, data);
        expect(error.status).toBe(400);

    });

    test('PUT /todos/{id} (400) invalid payload', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        let data = {
            "title": "Test title",
            "doneStatus": "true",
            "description": "This is a test description."
        };

        const error = await client.challenges.putTodos(headers, 123, data);
        expect(error.status).toBe(400);
    });

    test('POST /todos/{id} (200) Issue a POST request to successfully update a todo', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test title",
        }
        let origin = {
            "title": "Test",
            "doneStatus": true,
            "description": ""
        }
        let response = await client.challenges.postTodos(headers, origin);
        let id = response.data.id;
        await client.challenges.postTodosId(headers, data, id);
    });

    test('POST /todos/{id} (404) Issue a POST request to update a todo that does not exist', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test title",
        }
        const error = await client.challenges.postTodosId(headers, data, 123);
        expect(error.status).toBe(404);

    });

    test('PUT /todos/{id} (200) Issue a PUT request to successfully update a todo', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test title",
            "doneStatus": false,
            "description": "This is a test description."
        }
        let origin = {
            "title": "Test",
            "doneStatus": true,
            "description": ""
        }
        let response = await client.challenges.postTodos(headers, origin);
        let id = response.data.id;
        await client.challenges.putTodos(headers, id, data);
    });

    test('PUT /todos/{id} (200) Issue a PUT request to update an existing todo with just mandatory items in payload', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test title",
        }

        let origin = {
            "title": "Test",
            "doneStatus": true,
            "description": ""
        }
        let response = await client.challenges.postTodos(headers, origin);
        let id = response.data.id;
        await client.challenges.putTodos(headers, id, data);
    });

    test('PUT /todos/{id} no title (400)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "doneStatus": false,
            "description": "This is a test description."
        }
        let origin = {
            "title": "Test",
            "doneStatus": true,
            "description": ""
        }
        let response = await client.challenges.postTodos(headers, origin);
        let id = response.data.id;
        const error = await client.challenges.putTodos(headers, id, data);
        expect(error.status).toBe(400);

    });

    test('PUT /todos/{id} no amend id (400)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "id": 123,
        }
        let origin = {
            "title": "Test",
            "doneStatus": true,
            "description": ""
        }
        let response = await client.challenges.postTodos(headers, origin);
        let id = response.data.id;
        const error = await client.challenges.putTodos(headers, id, data);
        expect(error.status).toBe(400);

    });

    test('DELETE /todos/{id} (200)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let data = {
            "title": "Test title",
            "doneStatus": true,
            "description": "This is a test description."
        }
        let response = await client.challenges.postTodos(headers, data);
        let id = response.data.id;
        await client.challenges.deleteTodos(headers, id);
    });

    test('OPTIONS /todos (200)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        let response = await client.challenges.optionsTodos(headers);
        expect(response.status).toBe(200);
    });

    test('GET /todos (200) XML', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": "application/xml"
        };
        let response = await client.challenges.getTodos(headers);
        expect(response.data.includes('<')).toBe(true);
        expect(response.data.includes('>')).toBe(true);
    });

    test('GET /todos (200) JSON', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": "application/json"
        };
        let response = await client.challenges.getTodos(headers);

        let parsedData;
        try {
            if (typeof response.data === 'string') {
                parsedData = JSON.parse(response.data);
            } else {
                parsedData = response.data;
            }
        } catch (e) {
            throw new Error('Response is not valid JSON');
        }

        expect(typeof parsedData).toBe('object');
    });

    test('GET /todos (200) JSON ANY', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": "*/*"
        };
        let response = await client.challenges.getTodos(headers);

        let parsedData;
        try {
            if (typeof response.data === 'string') {
                parsedData = JSON.parse(response.data);
            } else {
                parsedData = response.data;
            }
        } catch (e) {
            throw new Error('Response is not valid JSON');
        }

        expect(typeof parsedData).toBe('object');
    });

    test('GET /todos (200) XML pref', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": "application/xml, application/json"
        };
        let response = await client.challenges.getTodos(headers);
        expect(response.data.includes('<')).toBe(true);
        expect(response.data.includes('>')).toBe(true);
    });

    test('GET /todos (200) no accept', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": ''
        };
        let response = await client.challenges.getTodos(headers);

        let parsedData;
        try {
            if (typeof response.data === 'string') {
                parsedData = JSON.parse(response.data);
            } else {
                parsedData = response.data;
            }
        } catch (e) {
            throw new Error('Response is not valid JSON');
        }

        expect(typeof parsedData).toBe('object');
    });

    test('GET /todos (406)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": 'application/gzip'
        };

        const error = await client.challenges.getTodos(headers);
        expect(error.status).toBe(406);

    });

    test('POST /todos XML', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": 'application/xml',
            "Content-type": 'application/xml'
        };

        const data = '<todo><doneStatus>true</doneStatus><title>file paperwork today</title></todo>'
        let responce = await client.challenges.postTodos(headers, data)
        expect(responce.status).toBe(201)

    });

    test.skip('POST /todos JSON', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": 'application/json',
            "Content-type": 'application/json'
        };

        const data = {
            "title": "Test titlesdfdsf",
            "doneStatus": true,
            "description": "This is a test description.dsfdsf"
        }

        let response = await client.challenges.postTodos(headers, data);
        expect(response.status).toBe(201);
    });

    test('POST /todos (415)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "Accept": 'application/json',
            "Content-type": 'Test'
        };

        const data = {
            "title": "Test title",
            "doneStatus": true,
            "description": "This is a test description."
        }

        const error = await client.challenges.postTodos(headers, data);
        expect(error.status).toBe(415);

    });

    test('GET /challenger/guid (existing X-CHALLENGER)', async ({ }) => {
        const guid = client.challenges.options.token;
        const headers = {
            "x-challenger": guid,
        };
        const response = await client.challenger.getGuild(guid, headers);
        expect(response.status).toBe(200);
    });

    test('PUT /challenger/guid RESTORE', async ({ }) => {
        const guid = client.challenges.options.token;
        const headers = {
            "x-challenger": guid,
        };

        const getResponse = await client.challenger.getGuild(guid, headers);
        expect(getResponse.status).toBe(200);

        const payload = getResponse.data;

        const putResponse = await client.challenger.putGuild(guid, headers, payload);
        expect(putResponse.status).toBe(200);
    });

    test.skip('PUT /challenger/guid CREATE', async ({ }) => {
        const guid = client.challenges.options.token;
        const headers = {
            "x-challenger": guid,
        };

        const getResponse = await client.challenger.getGuild(guid, headers);
        expect(getResponse.status).toBe(200);

        const payload = getResponse.data;

        const newGuid = "new-guid-not-in-memory";

        const putResponse = await client.challenger.putGuild(newGuid, headers, payload);
        expect(putResponse.status).toBe(200);

    });

    test('GET /challenger/database/guid', async ({ }) => {
        const guid = client.challenges.options.token;
        const headers = {
            "x-challenger": guid,
        };
        const response = await client.challenger.getDatabase(guid, headers);
        expect(response.status).toBe(200);
    });

    test('PUT /challenger/database/guid (Update)', async ({ }) => {
        const guid = client.challenges.options.token; // Use the token as the GUID
        const headers = {
            "x-challenger": guid,
        };

        const getResponse = await client.challenger.getDatabase(guid, headers);
        expect(getResponse.status).toBe(200);

        const payload = getResponse.data;

        const putResponse = await client.challenger.putDatabase(guid, headers, payload);
        expect(putResponse.status).toBe(204);
    });

    test.skip('POST /todos XML to JSON', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        const xmlData = `
        <todo>
            <doneStatus>true</doneStatus>
            <title>file paperwork today</title>
        </todo>
        `;
        const postResponse = await client.challenges.postTodoXml(headers, xmlData);
        expect(postResponse.status).toBe(201);
    });

    test.skip('POST /todos JSON to XML', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        const xmlData = `
        {
        "title": "create todo process payroll",
        "doneStatus": true,
        "description": ""
        }
        `;
        const postResponse = await client.challenges.postTodoJSON(headers, xmlData);
        expect(postResponse.status).toBe(201);
    });

    test('DELETE /heartbeat (405)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        const error = await client.challenges.deleteHeartbeat(headers);
        expect(error.status).toBe(405);
    });

    test('PATCH /heartbeat (500)', async ({ }) => {
        const headers = {
            "X-CHALLENGER": client.challenges.options.token,
        };

        const error = await client.challenges.patchHeartbeat(headers);
        expect(error.status).toBe(500);
    });

    test('TRACE /heartbeat (501)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        const error = await client.challenges.traceHeartbeat(headers);
        expect(error.status).toBe(501);
    });

    test('GET /heartbeat (204)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        const response = await client.challenges.getHeartbeat(headers);
        expect(response.status).toBe(204);
    });

    test('POST /heartbeat as DELETE (405)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            'X-HTTP-Method-Override': 'DELETE'
        };
        const error = await client.challenges.postHeartbeatOverride(headers);
        expect(error.status).toBe(405);
    });

    test('POST /heartbeat as PATCH (500)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            'X-HTTP-Method-Override': 'PATCH'
        };

        const error = await client.challenges.postHeartbeatOverride(headers);
        expect(error.status).toBe(500);
    });

    test('POST /heartbeat as Trace (501)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            'X-HTTP-Method-Override': 'TRACE'
        };
        const error = await client.challenges.postHeartbeatOverride(headers);
        expect(error.status).toBe(501);
    });

    test('POST /secret/token (401)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        const error = await client.challenges.postSecretToken(headers, 'YWRtaW46cGFzc3dvcmRk');
        expect(error.status).toBe(401);

    });

    test('POST /secret/token (200)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };

        const response = await client.challenges.postSecretToken(headers, "YWRtaW46cGFzc3dvcmQ=");
        expect(response.status).toBe(201);
    });

    test('GET /secret/note (403)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
            "X-AUTH-TOKEN": "TEST"
        };

        const error = await client.challenges.getSecretNote(headers);
        expect(error.status).toBe(403);

    });

    test('GET /secret/note (401)', async ({ }) => {
        const headers = {
            "x-challenger": client.challenges.options.token,
        };
        const error = await client.challenges.getSecretNote(headers);
        expect(error.status).toBe(401);

    });

    test('GET /secret/note (Bearer)', async ({ }) => {
        let headers = {
            "x-challenger": client.challenges.options.token,
        }

        const responseToken = await client.challenges.postSecretToken(headers, "YWRtaW46cGFzc3dvcmQ=");
        headers["X-AUTH-TOKEN"] = responseToken.headers['x-auth-token']
        const reponse = await client.challenges.getSecretNote(headers);
        expect(reponse.status).toBe(200);
    });

    test('POST /secret/note (Bearer)', async ({ }) => {
        let headers = {
            "x-challenger": client.challenges.options.token,
        }

        const data = {
            "note": "my note is here"
        }

        const responseToken = await client.challenges.postSecretToken(headers, "YWRtaW46cGFzc3dvcmQ=");
        headers["X-AUTH-TOKEN"] = responseToken.headers['x-auth-token']
        headers["Content-Type"] = "application/json"
        const reponse = await client.challenges.postSecretNote(headers, data);
        expect(reponse.status).toBe(200);
    });
});