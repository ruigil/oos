export const DropSchema = {
    name: 'Drop',
    primaryKey: '_id',

    properties: {
        _id: 'string',
        name: 'string',
        type: 'string',
        uid: 'string',
        date: 'int',
        content: '{}',
        recurrence: 'string',
        clone: 'bool',
        streams: 'Stream[]',
    }
}

export const StreamSchema = {
    name: 'Stream',
    primaryKey: '_id',

    properties: {
        _id: 'string',
        name: 'string',
        type: 'string',
        uid: 'string',
        content: '{}',
    }
}

export const UserSchema = {
    name: 'User',
    primaryKey: '_id',

    properties: {
        _id: 'string',
        username: 'string',
        bio: 'string',
        avatar: 'string',
        location: 'string',
        settings: '{}',
    }
}
