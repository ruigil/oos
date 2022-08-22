export const DropSchema = {
    name: 'Drop',
    primaryKey: '_id',

    properties: {
        _id: 'string',
        type: 'string',
        date: 'int',
        title: 'string',
        text: 'string',
        recurrence: 'string',
        clone: 'bool',
        uid: 'string',
        content: '{}',
        tags: 'Tag[]',
    }
}

export const TagSchema = {
    name: 'Tag',
    primaryKey: '_id',

    properties: {
        _id: 'string',
        name: 'string',
        type: 'string',
        description: 'string',
        uid: 'string',
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
