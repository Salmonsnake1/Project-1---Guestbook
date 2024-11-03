const express = require('express'); // imports express
const fs = require('fs'); // imports file reading and writing
const path = require('path'); // for file and directory paths
const app = express(); // inits Express app
const port = process.env.PORT || 3000; // set from environ var or from default 3000

app.use(express.json()); // parse json 
app.use(express.urlencoded({ extended: true })); // parse URL-encoded

const baseStyles = `
    <style>
        body { font-family: Arial, sans-serif; background-color: #f2f2f2; color: #333; }
        .container { display: flex; max-width: 1000px; margin: 0 auto; padding: 20px; }
        .sidebar { width: 200px; padding-right: 20px; }
        .sidebar a { display: block; padding: 10px; margin-bottom: 10px; background-color: #ddd; color: #333; text-decoration: none; text-align: center; border-radius: 5px; }
        .sidebar a:hover { background-color: #bbb; }
        .content { flex: 1; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        h1 { color: #444; }
        p { line-height: 1.6; margin-bottom: 15px; }
        table { width: 100%; margin-top: 20px; }
    </style>
`;

const sidebar = `
    <div class="sidebar">
        <a href="/">Home</a>
        <a href="/guestbook">Guestbook</a>
        <a href="/newmessage">Leave a Message</a>
        <a href="/ajaxmessage">Leave a Message with AJAX</a>
    </div>
`;

// above is sidebar and CSS styles to define on all pages for ease

// below is main home page route, with the stylesheeting as well as some created text, adds in the basestyles and sidebar.
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Welcome to Dyson's Hotels</title>
                <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css">
                ${baseStyles}
            </head>
            <body>
                <div class="container">
                    ${sidebar}
                    <div class="content">
                        
                        <h1>Welcome to Dyson's Hotels</h1>
                        <p>Our hotels are designed with your comfort in mind, offering world-class amenities and exceptional service at every location. Explore our beautiful rooms, enjoy fine dining, and relax in luxury at Dyson's Hotels.</p>
                        <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultrices tincidunt mi et tempor. Maecenas ut tortor in odio sollicitudin mollis. Nulla in libero porta, finibus nisi id, iaculis nulla. Fusce at scelerisque nibh, ac lobortis est. Duis viverra, felis ultrices tincidunt dapibus, nibh augue suscipit libero, eget gravida urna velit id diam. Suspendisse a ante mattis, facilisis magna quis, tincidunt eros. Nullam mattis nisi tristique est ullamcorper lacinia. Maecenas posuere euismod nisl, sit amet dignissim ipsum commodo a.
Nunc mattis aliquam ipsum, semper imperdiet lectus mollis vel. Suspendisse enim justo, accumsan in scelerisque eu, porttitor sed augue. Mauris non vestibulum ipsum, sed mollis arcu. Nulla odio eros, ultricies quis scelerisque non, porta ut sem. In vehicula nisi viverra congue dapibus. Nam risus mauris, vulputate eget libero eu, accumsan fringilla leo. Morbi turpis nulla, feugiat in pharetra ut, aliquam tincidunt tortor. Fusce at orci et sapien dignissim dapibus. Morbi sed condimentum elit. Curabitur mollis lorem at ex ultricies, elementum egestas neque interdum. Donec venenatis tempus accumsan. Cras eget enim sed ante tempus vestibulum.
Aliquam ac mi ut ex tincidunt tempus. Vestibulum pulvinar lorem vitae metus malesuada, in vulputate nulla dapibus. Curabitur elementum eleifend feugiat. Integer dignissim neque vel ex lobortis, at interdum mauris mattis. Sed in dictum odio. Donec eget sem vitae dui faucibus condimentum a in arcu. Vestibulum orci quam, imperdiet nec maximus eget, pulvinar eu erat. Proin mauris massa, commodo a blandit vel, eleifend eget libero. Integer a erat ante.
Vestibulum velit nisl, tincidunt non dui ac, condimentum vulputate sem. Aenean ut iaculis nulla. Sed varius, libero ut interdum tincidunt, lorem nulla euismod leo, ac rhoncus est elit ut orci. Mauris blandit dolor et gravida tristique. Etiam nec risus velit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut elit lorem, ornare sed orci id, viverra placerat lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed eu sagittis neque, vel luctus mi. Proin nec urna condimentum, venenatis justo eget, feugiat lectus. Nullam sagittis lacus dolor, ac euismod purus pulvinar id. Proin in nisl placerat ipsum vulputate molestie et aliquet leo. Praesent sed nisi interdum, pellentesque ipsum non, vulputate mauris. Integer et massa rutrum, pulvinar nunc sit amet, semper ex. Etiam vel felis neque. </p>                        
                    </div>
                </div>
            </body>
        </html>
    `);
});

// guestbook route, loads and reads the json file and displays it in a table. Has an error catch and then parsing JSON data to array then making that into a table
app.get('/guestbook', (req, res) => {
    const dataPath = path.join(__dirname, 'guestbookdata.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error loading guestbook data');
            return;
        }
        
        const messages = JSON.parse(data);
        const rows = messages.map(msg => `
            <tr>
                <td>${msg.id}</td>
                <td>${msg.username}</td>
                <td>${msg.country}</td>
                <td>${new Date(msg.date).toLocaleString()}</td>
                <td>${msg.message}</td>
            </tr>
        `).join('');

        res.send(`
            <html>
                <head>
                    <title>Guestbook</title>
                    <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css">
                    ${baseStyles}
                </head>
                <body>
                    <div class="container">
                        ${sidebar}
                        <div class="content">
                        
                            <h1>Guestbook Entries</h1>
                            <table class="pure-table pure-table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Country</th>
                                        <th>Date</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </body>
            </html>
        `);
    });
});

// Route for a new message form, so creating an input form too
app.get('/newmessage', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Leave a Message</title>
                <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css">
                ${baseStyles}
            </head>
            <body>
                <div class="container">
                    ${sidebar}
                    <div class="content">
                        <h1>Add a New Message</h1>
                        <form action="/newmessage" method="POST" class="pure-form pure-form-stacked">
                            <fieldset>
                                <label for="username">Username</label>
                                <input type="text" name="username" id="username" required />
                                
                                <label for="country">Country</label>
                                <input type="text" name="country" id="country" required />
                                
                                <label for="message">Message</label>
                                <textarea name="message" id="message" required></textarea>
                                
                                <button type="submit" class="pure-button pure-button-primary">Submit</button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// posting and sending the entered form to json, with some error catches
app.post('/newmessage', (req, res) => {
    const { username, country, message } = req.body;
    if (!username || !country || !message) {
        return res.status(400).send('All fields are required!');
    }

    // checks json file for next ID
    const dataPath = path.join(__dirname, 'guestbookdata.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading guestbook data');
            return;
        }

        const messages = JSON.parse(data);
        
        // this for finding the new ID number
        const lastID = messages.length > 0 ? Math.max(...messages.map(msg => parseInt(msg.id, 10))) : 0;
        const newID = lastID + 1;

        // new message data to be entered
        const newMessage = {
            id: newID.toString(),
            username,
            country,
            date: new Date().toISOString(),
            message
        };

        // adding messages to erray
        messages.push(newMessage);

        // updating json file
        fs.writeFile(dataPath, JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error saving message');
                return;
            }
            res.redirect('/guestbook');
        });
    });
});

// Like new message route but now for AJAX
app.get('/ajaxmessage', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Leave a Message with AJAX</title>
                <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css">
                ${baseStyles}
            </head>
            <body>
                <div class="container">
                    ${sidebar}
                    <div class="content">
                        
                        <h1>Add a New Message (AJAX)</h1>
                        <form id="ajaxForm" class="pure-form pure-form-stacked">
                            <fieldset>
                                <label for="username">Username</label>
                                <input type="text" name="username" id="username" required />
                                
                                <label for="country">Country</label>
                                <input type="text" name="country" id="country" required />
                                
                                <label for="message">Message</label>
                                <textarea name="message" id="message" required></textarea>
                                
                                <button type="button" id="submitBtn" class="pure-button pure-button-primary">Submit</button>
                            </fieldset>
                        </form>
                        
                        <h2>All Messages</h2>
                        <div id="messages"></div>
                        
                        <script>
                            document.getElementById('submitBtn').addEventListener('click', function() {
                                const username = document.getElementById('username').value;
                                const country = document.getElementById('country').value;
                                const message = document.getElementById('message').value;

                                if (!username || !country || !message) {
                                    alert('All fields are required!');
                                    return;
                                }

                                fetch('/ajaxmessage', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ username, country, message })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    document.getElementById('username').value = '';
                                    document.getElementById('country').value = '';
                                    document.getElementById('message').value = '';

                                    const messagesDiv = document.getElementById('messages');
                                    messagesDiv.innerHTML = '<table class="pure-table pure-table-bordered"><thead><tr><th>ID</th><th>Username</th><th>Country</th><th>Date</th><th>Message</th></tr></thead><tbody>' +
                                    data.map(msg => \`
                                        <tr>
                                            <td>\${msg.id}</td>
                                            <td>\${msg.username}</td>
                                            <td>\${msg.country}</td>
                                            <td>\${new Date(msg.date).toLocaleString()}</td>
                                            <td>\${msg.message}</td>
                                        </tr>
                                    \`).join('') +
                                    '</tbody></table>';
                                })
                                .catch(error => console.error('Error:', error));
                            });
                        </script>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// Now like new message post but for Ajax, with error catch
app.post('/ajaxmessage', (req, res) => {
    const { username, country, message } = req.body;
    if (!username || !country || !message) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    // Checking JSon file
    const dataPath = path.join(__dirname, 'guestbookdata.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading guestbook data' });
        }

        const messages = JSON.parse(data);

        // next ID check
        const lastID = messages.length > 0 ? Math.max(...messages.map(msg => parseInt(msg.id, 10))) : 0;
        const newID = lastID + 1;

        // New message entry prep
        const newMessage = {
            id: newID.toString(),
            username,
            country,
            date: new Date().toISOString(),
            message
        };

        // adding message to array
        messages.push(newMessage);

        // Updating JSON
        fs.writeFile(dataPath, JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error saving message' });
            }
            res.json(messages); // gives the updated guestbook
        });
    });
});

// 404 error check
app.get('*', (req, res) => {
    res.status(404).send('Cannot find the requested page');
});

// Starts the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});