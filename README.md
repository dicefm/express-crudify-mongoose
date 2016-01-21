Express CRUDify Mongoose
=========================


[![NPM version](https://badge.fury.io/js/express-crudify-mongoose.svg)](http://badge.fury.io/js/express-crudify-mongoose)
[![Build Status](https://img.shields.io/travis/KATT/express-crudify-mongoose.svg)](https://travis-ci.org/KATT/express-crudify-mongoose)
[![Coverage Status](https://img.shields.io/coveralls/KATT/express-crudify-mongoose.svg)](https://coveralls.io/r/KATT/express-crudify-mongoose?branch=master)
[![Dependency Status](https://img.shields.io/david/KATT/express-crudify-mongoose.svg)](https://david-dm.org/KATT/express-crudify-mongoose)
[![devDependency Status](https://img.shields.io/david/dev/KATT/express-crudify-mongoose.svg)](https://david-dm.org/KATT/express-crudify-mongoose#info=devDependencies)

Like [express-restify-mongoose](https://github.com/florianholzapfel/express-restify-mongoose) but with way less ambition.

Produces a simple CRUD interface.

## Dependencies / tools

* Babel
* ..


## Usage

```
npm install express-crudify-mongoose --save
```

```js
const UserSchema = new Schema({
    name : {type: String, required: true},
    email: {type: String, required: true},
    admin: {type: Boolean, default: false, required: true},
});

const Users = db.model('user', UserSchema);
const readonly = ['admin'];

const crud = crudify({
    readonly,
    Model: Users,
});

server.use('/users', crud);
```

### Endpoints

* GET `/users`
* POST `/users`
* GET `/users:_id`
* PATCH `/users/:_id`
* DELETE `/users/:_id`


### Operations



#### Filter

```
GET /users?name=Alex
```

Select all users with where name `Alex`.


#### Selecting partial outputs

```
GET /users?$select=name,email
GET /users/:id?$select=name,email
```

Only output name & email.

### Middlewares

Middlewares can be async by being ES7 async functions or functions returning promises. 

If you pass in an array of functions, they'll be executed sequentially.


#### preSave

Useful for custom validation, that you'd only want to run when change is done through API request and can therefore simply not be done by Mongoose's `.pre('save', fn)`.


```js
const readonly = ['admin'];
const Users = db.model('user', UserSchema);

const preSave = async (user) => {
	if (user.admin) {
		let err = new Error("Can't change admin users through API");
		err.statusCode = 400;

		throw err;
	}
	let err = new Error('Validation failed');
	
	
	const newData = data;
	
	// return the newData that you want in the output
	return newData;
}

const crud = crudify({
    Model: Users,
    readonly,
    preSave, // preSave: [preSave, ..] is also supported
});
```


#### preOutput

`preOutput` functions will receive an object with properties `data` and `req`.

* `req` is the current 
* `data` is the data that is currently set to be output to client.


Note that `preOutput` is run the same for all endpoints, so sometimes `data` is an array and sometimes it's a singular item.

```js
const Users = db.model('user', UserSchema);

const preOutput = async (data) => {
	const newData = data;
	
	// return the newData that you want in the output
	return newData;
}

const crud = crudify({
    Model: Users,
    preOutput, // preOutput: [preOutput, ..] is also supported
});
```


### Development

1. Clone project
* `make setup`
* `make run`


#### Git Commit Messages

Based on [atom](https://github.com/atom/atom/blob/3b3baac14e78e66cb4c33f0f70b08aa94789d982/CONTRIBUTING.md#git-commit-messages) & [dannyfritz/commit-message-emoji](https://github.com/dannyfritz/commit-message-emoji).

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally
* Start the commit message with an applicable emoji:

    Commit Type | Emoji
    ----------  | -------------
    Initial Commit | :tada: `:tada:`
    Version Tag | :bookmark: `:bookmark:`
    New Feature | :sparkles: `:sparkles:`
    Bugfix | :bug: `:bug:`
    Metadata | :card_index: `:card_index:`
    Documentation | :books: `:books:`
    Performance | :racehorse: `:racehorse:`
    Cosmetic/refactor | :art: `:art:`
    Lint fixes | :shirt: `:shirt:`
    Tests | :white_check_mark: `:white_check_mark:`
    Removing files | :fire: `:fire:`
    Security | :lock: `:lock:`
    Upgrade deps | :arrow_up: `:arrow_up:`
    Downgrade deps | :arrow_down: `:arrow_down:`
    General Update | :zap: `:zap:`
    Adding to debt | :mask: `:mask:`
    Other | [Be creative](http://www.emoji-cheat-sheet.com/)

### Code

TBC

#### Run project:

```sh
make run
```


### Deploy

TBC

## Documentation




## Team

* Development:
    - [Alexander Johansson](https://github.com/KATT)
