const fs = require('fs');

/**
 * @param { string } path
 * @param { string } encoding
 * @return { promise<string> }
 * */
const _readFileAsync = (path, encoding = 'UTF8') => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {encoding: encoding}, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

/**
 * @param { string } path
 * @param { string } data
 * @param { string } encoding
 * @return { promise<string> }
 * */
const _writeFileAsync = (path, data, encoding = 'UTF8') => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, {encoding: encoding}, (err) => {
            if (err) reject(err.message);
            resolve('Writing to file has been done successfully...');
        });
    });
};

/**
 * @param { string } path
 * @return { promise<string[]> }
 * */
const _readDirectoryAsync = (path): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) reject(err);
            resolve(files);
        });
    });
};

/**
 * @param { string } path
 * @param { string } encoding
 * @param { string } fileSubstringToTest
 * @return { promise<promise[]> }
 * @description it will read the directory according to provided path, then it checks fileSubstringToTest
 * in case it match, it will be read according to encoding and pushed in return promise array
 * */
const _readAllFilesInDirectoryAsync = (path, encoding = 'UTF8', fileSubstringToTest = '') => {
    return _readDirectoryAsync(path)
        .then((files) => {
            const promisesResult = [];
            for (let i = 0; i < files.length; i++) {
                if (files[i].includes(fileSubstringToTest)) {
                    const resultPromise = _readFileAsync(path + files[i], encoding);
                    promisesResult.push(resultPromise);
                }
            }
            return promisesResult;
        })
        // eslint-disable-next-line no-unused-vars
        .catch(_ => []);
};

/**
 * @param { string } path
 * @param { string } encoding
 * @param { string[] } imagePaths to create
 * @return { promise<promise[]> }
 * @description it will read the directory according to provided path, then it checks foreach path in imagePaths
 * in case it match, it will be read according to encoding and pushed in return promise array
 * */
const _readAllFilesInDirectoryWithSpecifiedImagePathsAsync = (path, encoding = 'UTF8', imagePaths = []) => {
    return _readDirectoryAsync(path)
        .then((files) => {
            const promisesResult = [];
            for (let i = 0; i < imagePaths.length; i++) {
                for (let j = 0; j < files.length; j++) {
                    const p = imagePaths[i];
                    const f = files[j];

                    const found = p.toString().indexOf(f);

                    if (found) {
                        const resultPromise = _readFileAsync(`${path}/${files[j]}`, encoding);
                        promisesResult.push(resultPromise);
                        break;
                    }
                }
            }

            return promisesResult;
        })
        // eslint-disable-next-line no-unused-vars
        .catch(_ => []);
};

/**
 * @param { string } directory to create
 * @return { promise }
 * @description it will create directory according to provided path
 * */
const _creatingDirectory = (directory) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(directory, {recursive: true}, (err) => {
            if (!err) resolve(1);
            else reject(-1);
        });
    });
};

/**
 * @param { string } directory to create
 * @return { promise }
 * @description it will create directory according to provided path in case it does not exist, so it will make a pre-check
 * */
const _createDirectoryIfDoesNotExist = (directory) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, _) => {
        fs.exists(directory, async (doesExist) => {
            if (doesExist) {
                resolve(0);
            } else {
                const creatingDirectoryCode = await _creatingDirectory(directory);
                resolve(creatingDirectoryCode);
            }
        });
    });
};

/**
 * @param { string } directory to create
 * @param { string } filename to remove
 * @return { promise<string|Object|null> }
 * */
const _removeFileAsync = (directory, filename) => {
    return _readDirectoryAsync(directory)
        .then((files) => {
            for (let i = 0; i < files.length; i++) {
                const f = files[i];
                if (f.indexOf(filename) !== -1) {
                    return new Promise((resolve, reject) => {
                        fs.unlink(`${directory}/${f}`, (err) => {
                            if (err) reject(err);
                            resolve('Deleted successfully...!');
                        });
                    });
                }
            }

        })
        .catch(err => {
            console.log(err);
            return null;
        });

};

export const FileHandler = {
    readFileAsync: _readFileAsync,
    writeFileAsync: _writeFileAsync,
    readDirectoryAsync: _readDirectoryAsync,
    readAllFilesInDirectoryAsync: _readAllFilesInDirectoryAsync,
    createDirectoryIfDoesNotExist: _createDirectoryIfDoesNotExist,
    readAllFilesInDirectoryWithSpecifiedImagePathsAsync: _readAllFilesInDirectoryWithSpecifiedImagePathsAsync,
    removeFileAsync: _removeFileAsync
};