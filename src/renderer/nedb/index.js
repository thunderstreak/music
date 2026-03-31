// localStorage-based data store compatible with nedb API
class LocalStore {
    constructor(name) {
        this.name = name;
    }

    _load() {
        try {
            return JSON.parse(localStorage.getItem(this.name) || '[]');
        } catch (e) {
            return [];
        }
    }

    _save(data) {
        localStorage.setItem(this.name, JSON.stringify(data));
    }

    _generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    _matches(doc, query) {
        for (const key in query) {
            const condition = query[key];
            if (condition !== null && typeof condition === 'object' && !Array.isArray(condition)) {
                if ('$exists' in condition) {
                    if (condition.$exists && !(key in doc)) return false;
                    if (!condition.$exists && key in doc) return false;
                } else if ('$regex' in condition) {
                    if (!condition.$regex.test(doc[key])) return false;
                } else {
                    if (doc[key] !== condition) return false;
                }
            } else if (doc[key] !== condition) {
                return false;
            }
        }
        return true;
    }

    ensureIndex(options, callback) {
        if (callback) callback(null);
    }

    find(query, callback) {
        const data = this._load();
        const results = data.filter(doc => this._matches(doc, query));

        const chain = {
            sort: (sortSpec) => {
                const key = Object.keys(sortSpec)[0];
                const dir = sortSpec[key];
                const sorted = [...results].sort((a, b) => {
                    if (a[key] < b[key]) return dir === 1 ? -1 : 1;
                    if (a[key] > b[key]) return dir === 1 ? 1 : -1;
                    return 0;
                });
                return {
                    exec: (cb) => { if (cb) cb(null, sorted); }
                };
            },
            exec: (cb) => { if (cb) cb(null, results); }
        };

        if (callback) callback(null, results);
        return chain;
    }

    insert(doc, callback) {
        const data = this._load();
        const newDoc = Object.assign({}, doc, { _id: this._generateId() });
        data.push(newDoc);
        this._save(data);
        if (callback) callback(null, newDoc);
        return newDoc;
    }

    update(query, update, options, callback) {
        const data = this._load();
        let numAffected = 0;
        const updatedData = data.map(doc => {
            if (this._matches(doc, query)) {
                numAffected++;
                if (update.$set) {
                    return Object.assign({}, doc, update.$set);
                } else if (update.$inc) {
                    const updated = Object.assign({}, doc);
                    for (const key in update.$inc) {
                        updated[key] = (updated[key] || 0) + update.$inc[key];
                    }
                    return updated;
                } else {
                    return Object.assign({}, update, { _id: doc._id });
                }
            }
            return doc;
        });
        this._save(updatedData);
        if (callback) callback(null, numAffected, null);
    }

    remove(query, options, callback) {
        const data = this._load();
        const newData = data.filter(doc => !this._matches(doc, query));
        const numRemoved = data.length - newData.length;
        this._save(newData);
        if (callback) callback(null, numRemoved);
    }
}

const db = {
    collectData: new LocalStore('collectData'),
    songData: new LocalStore('songData'),
    confData: new LocalStore('confData'),
    mvData: new LocalStore('mvData'),
};

export default db;
