const express = require('express');
const bodyPaster = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const e = require('express');
const jwt = require('jsonwebtoken');
// 
// const ExcelJS = require('exceljs');
// 
const privateJwtKey = 'SomeBodyOnceToldMe';

const app = express();
app.use(cors());
app.use(bodyPaster.json());
app.use(bodyPaster.urlencoded({ extended: false }));

//routes

app.post('/timetables/1/add', (req, res, next) => {
    let data = req.body;
    const spec = req.body.spec;
    //read the timуеtable
    fs.readFile('./data/' + spec + '/timetable.json', 'utf8', function (err, contents) {
        if (err) {
            return res.status(500).json(err);
        }
        let file = JSON.parse(contents);
        //pasrsing
        data.lessonDate.forEach(element => {
            if (file[element]) {
                data.lessonGroup.forEach(group => {
                    let tempData = data.lessonTime;
                    if (file[element][group]) {
                        if (file[element][group][data.lessonTime]) {
                            file[element][group][data.lessonTime].title = data.lessonName;
                            file[element][group][data.lessonTime].type = data.lessonType;
                            file[element][group][data.lessonTime].teacher = data.lessonTeacher;
                            file[element][group][data.lessonTime].color = data.lessonColor;
                            file[element][group][data.lessonTime].link = data.lessonLink;
                        } else {
                            file[element][group][data.lessonTime] = {};
                            file[element][group][data.lessonTime].title = data.lessonName;
                            file[element][group][data.lessonTime].type = data.lessonType;
                            file[element][group][data.lessonTime].teacher = data.lessonTeacher;
                            file[element][group][data.lessonTime].color = data.lessonColor;
                            file[element][group][data.lessonTime].link = data.lessonLink;
                        }
                    } else {
                        file[element][group] = {};
                        file[element][group][data.lessonTime] = {};
                        file[element][group][data.lessonTime].title = data.lessonName;
                        file[element][group][data.lessonTime].type = data.lessonType;
                        file[element][group][data.lessonTime].teacher = data.lessonTeacher;
                        file[element][group][data.lessonTime].color = data.lessonColor;
                        file[element][group][data.lessonTime].link = data.lessonLink;
                    }
                });
            } else {
                file[element] = {};
                data.lessonGroup.forEach(group => {
                    file[element][group] = {};
                    file[element][group][data.lessonTime] = {};
                    file[element][group][data.lessonTime].title = data.lessonName;
                    file[element][group][data.lessonTime].type = data.lessonType;
                    file[element][group][data.lessonTime].teacher = data.lessonTeacher;
                    file[element][group][data.lessonTime].color = data.lessonColor;
                    file[element][group][data.lessonTime].link = data.lessonLink;
                });
            }
        });

        //save the new timetable
        fs.writeFileSync('./data/' + spec + '/timetable.json', JSON.stringify(file, null, 2), function (err, contents) {
            if (err) return res.status(500).json(err);
            res.status(200);
        });
    });
});

app.post('/timetables/1/getCal', (req, res, next) => {
    const group = req.body.group;
    const dateStart = req.body.start;
    const spec = req.body.spec;
    const year = new Date(new Date(dateStart).setDate(new Date(dateStart).getDate() + 15)).getFullYear();
    const dateEnd = req.body.end;
    let responce = [];
    //read the timetable;
    fs.readFile('./data/' + spec + '/timetable.json', 'utf8', function (err, contents) {
        if (err) {
            return res.status(500).json(err);
        }
        let file = JSON.parse(contents);
        for (key in file) {
            //!!!REWEITE THIS BLOCK!!!
            if ((key >= dateStart) && (key <= dateEnd)) {
                for (number in file[key][group]) {
                    let date = new Date(key);
                    date.setDate(date.getDate() + 1);
                    switch (Number(number)) {
                        case 1:
                            responce.push({
                                start: date.setUTCHours(09, 00),
                                end: date.setUTCHours(10, 20),
                                title: file[key][group][number].title + '(' + file[key][group][number].type + ')',
                                color: file[key][group][number].color,
                                url: file[key][group][number].link,
                                extendedProps: { teacher: file[key][group][number].teacher, lessonNumber: number, date: key }
                            });
                            break;
                        case 2:
                            responce.push({
                                start: date.setUTCHours(10, 30),
                                end: date.setUTCHours(11, 50),
                                title: file[key][group][number].title + '(' + file[key][group][number].type + ')',
                                color: file[key][group][number].color,
                                url: file[key][group][number].link,
                                extendedProps: { teacher: file[key][group][number].teacher, lessonNumber: number, date: key }

                            });
                            break;
                        case 3:
                            responce.push({
                                start: date.setUTCHours(12, 10),
                                end: date.setUTCHours(13, 30),
                                title: file[key][group][number].title + '(' + file[key][group][number].type + ')',
                                color: file[key][group][number].color,
                                url: file[key][group][number].link,
                                extendedProps: { teacher: file[key][group][number].teacher, lessonNumber: number, date: key }
                            });
                            break;
                        case 4:
                            responce.push({
                                start: date.setUTCHours(13, 40),
                                end: date.setUTCHours(15, 00),
                                title: file[key][group][number].title + '(' + file[key][group][number].type + ')',
                                color: file[key][group][number].color,
                                url: file[key][group][number].link,
                                extendedProps: { teacher: file[key][group][number].teacher, lessonNumber: number, date: key }
                            });
                            break;
                        default:
                            break;
                    }
                }

            }
        }
        //
        //read the bithrdays
        fs.readFile('./data/' + spec + '/birthday.json', 'utf8', function (err, contents) {
            if (err) return res.status(500).json(err);
            let file = JSON.parse(contents);
            for (key in file) {
                file[key].forEach((el) => {
                    let BDay = {
                        start: new Date(key).setFullYear(year),
                        title: '🎉' + el + ' (' + (year - new Date(key).getFullYear()) + ')',
                        allDay: true,
                        color: '#ff5733',
                        extendedProps: { type: 'bday' }
                    }
                    responce.push(BDay);
                })
            }
            res.json(responce).status(200);
        });
    });

});

app.post('/authAdmin', (req, res, next) => {
    const candidate = {
        login: req.body.login,
        password: req.body.password
    };
    console.log('candidate', candidate);

    fs.readFile('./data/users.json', 'utf8', async function (err, contents) {
        let file = JSON.parse(contents);
        // console.log('file', file);

        if (file[candidate.login]) {
            if (candidate.password == file[candidate.login].password) {
                jwt.sign({
                    login: candidate.login,
                    type: file[candidate.login].type,
                    groups: file[candidate.login].groups,
                    spec: file[candidate.login].spec,
                    id: file[candidate.login].id
                },
                    privateJwtKey,
                    { expiresIn: '1h' },
                    (err, token) => {
                        if (err) return res.status(500).json({ msg: 'server jwt gen error', err })
                        return res.status(200).json({ msg: 'login succses', JWT: token });
                    });
            } else {
                return res.status(401).json({ msg: 'password is wrong' });
            }
        } else {
            return res.status(404).json({ msg: 'user not found' });
        }

        // for (key in file) {
        //     if (key == candidate.login) {
        //         if (candidate.password == file[key].password) {

        //             // jwt.sign({ login: key, type:file[key].type, id: file[key].id  }, {expiresIn: '1h' }, privateJwtKey, function (err, token) {
        //             //     if (err) { return res.status(500).json({ msg: 'server jwt gen error', err }); } else {
        //             //         return res.status(200).json({ msg: 'login succses', JWT: token });
        //             //     };
        //             // });

        //             //IDK WHY

        //             try {
        //                 const token = jwt.sign({
        //                     data: {
        //                         login: key,
        //                         type: file[key].type,
        //                         groups: file[key].groups,
        //                         spec: file[key].spec,
        //                         id: file[key].id
        //                     }
        //                 }, privateJwtKey, { expiresIn: '1h' });
        //                 return res.status(200).json({ msg: 'login succses', JWT: token });

        //             } catch (error) {
        //                 console.log(error);
        //                 return res.status(500).json({ msg: 'server jwt gen error', error });
        //             }
        //         } else {
        //         // return res.status(401).json({msg:'password is wrong'});                    
        //         }
        //     } else {
        //         console.log('404');
        //         return res.status(404).json({msg:'user not found'});
        //     }
        // }
    });

})

app.post('/lk', (req, res, next) => {
    const token = req.body.token;
    // console.log(token);
    if (token) {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err) {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else {
                return res.status(200).json({ msg: 'success', decoded });
            }
        });
    } else {
        return res.status(405).json({ msg: 'token not sended', });
    }
})

app.post('/removeLesson', (req, res, next) => {
    console.log('DELETING');
    const token = req.body.token;
    const group = req.body.group;
    const number = req.body.lessonNumber;
    const date = req.body.date.substr(0, 10);
    if (token) {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err) {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else {
                fs.readFile('./data/' + decoded.spec + '/timetable.json', 'utf8', function (err, contents) {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    let file = JSON.parse(contents);
                    console.log('Deleted lesson.');
                    try {
                        delete file[date][group][number];

                    } catch (error) {
                        return res.status(500).json(error)
                    }
                    fs.writeFile('./data/' + decoded.spec + '/timetable.json', JSON.stringify(file, null, 2), function (err, contents) {
                        console.log(err, contents);
                        if (err) return res.status(500).json(err)
                        return res.status(200).json({ msg: 'DELETED' })
                    });

                });
            }
        });
    } else {
        return res.status(405).json({ msg: 'token not sended', });
    }
})

app.post('/editLesson', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const number = req.body.lessonNumber;
    const date = req.body.date.substr(0, 10);
    const editType = req.body.editType;
    const newData = req.body.newData;
    console.log(newData);
    if (token) {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err) {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else {
                fs.readFile('./data/' + decoded.spec + '/timetable.json', 'utf8', function (err, contents) {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    let file = JSON.parse(contents);
                    console.log('date :', date);
                    console.log('group :', group);
                    console.log('number :', number);
                    switch (editType) {
                        case 'title':
                            file[date][group][number].title = newData.lessonName;
                            file[date][group][number].type = newData.lessonType;
                            break;
                        case 'teacher':
                            file[date][group][number].teacher = newData.lessonTeacher;
                            break;
                        case 'link':
                            console.log(file[date][group][number]);
                            file[date][group][number].link = newData.lessonLink;
                            console.log(file[date][group][number]);
                            break;
                        default:
                            return res.status(400).json({ err: 'NOTFOUNDTYPE' });
                            break;
                    }
                    // file[date][group][number]

                    fs.writeFileSync('./data/' + decoded.spec + '/timetable.json', JSON.stringify(file, null, 2), function (err, contents) {
                        if (err) {
                            return res.status(500).json(err)
                        } else {
                            return res.status(200).json('DELETED')

                        }

                    });

                });
                return res.status(200).json({ msg: 'success', decoded });
            }
        });
    } else {
        return res.status(405).json({ msg: 'token not sended', });
    }
})


//token
app.post('/addLesson', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const lessonName = req.body.data.lessonName;
    const lessonType = req.body.data.lessonType;
    const lessonLink = req.body.data.lessonLink;
    const lessonTeacher = req.body.data.lessonTeacher;
    const lessonNumber = req.body.data.lessonNumber;
    const lessonDate = req.body.data.lessonDate.substr(0, 10);
    // console.log(req.body);
    if (token) {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err) {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else {
                fs.readFile('./data/' + decoded.spec + '/timetable.json', 'utf8', function (err, contents) {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    let file = JSON.parse(contents);

                    //Проверка, сущесвуте ли этот день в базеЖ
                    if (file[lessonDate]) {
                        //Проверка, сущесвуте ли эта групра
                        if (file[lessonDate][group]) {
                            //Проверка, сущесвуте ли эт0 занятие
                            if ((!file[lessonDate][group][lessonNumber]) || (file[lessonDate][group][lessonNumber] == {})) {
                                console.log('not exist');
                                file[lessonDate][group][lessonNumber] = {
                                    title: lessonName,
                                    type: lessonType,
                                    teacher: lessonTeacher,
                                    link: lessonLink,
                                }
                            } else {
                                return res.status(500).json({ msg: 'Наложение! На это время пара уже существует. ' });
                            }
                        } else {
                            file[lessonDate][group] = {};
                            file[lessonDate][group][lessonNumber] = {
                                title: lessonName,
                                type: lessonType,
                                teacher: lessonTeacher,
                                link: lessonLink,
                            }
                        }
                    } else {
                        file[lessonDate] = {};
                        file[lessonDate][group] = {};
                        file[lessonDate][group][lessonNumber] = {
                            title: lessonName,
                            type: lessonType,
                            teacher: lessonTeacher,
                            link: lessonLink,
                        };
                    }

                    fs.writeFile('./data/' + decoded.spec + '/timetable.json', JSON.stringify(file, null, 2), function (err, contents) {
                        console.log(err, contents);
                        if (err) return res.status(500).json(err)
                        return res.status(200).json({ msg: 'ADDED' })
                    });

                });
            }
        });
    } else {
        return res.status(405).json({ msg: 'token not sended', });
    }

})






app.post('/get/options', (req, res, next) => {
    const token = req.body.token;
    if (token) {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err) {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else {
                fs.readFile('./data/options.json', 'utf8', function (err, contents) {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    let file = JSON.parse(contents);
                    return res.status(200).json({ msg: 'success', file });
                });
            }
        });
    } else {
        return res.status(405).json({ msg: 'token not sended', });
    }
})

app.post('/get/oneDay', (req, res, next) => {
    const spec = req.body.spec;
    const group = req.body.group;
    let date = req.body.date.substr(0, 10)

    fs.readFile('./data/' + spec + '/timetable.json', 'utf8', function (err, contents) {
        if (err) {
            return res.status(500).json(err);
        }
        let file = JSON.parse(contents);
        try {
            file = file[date][group]
            return res.status(200).json({ msg: 'success', day: file });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: 'Вероятно, на эту дату нет занятий...', err: '123' });
        }
    });

})


app.post('/test1', (req, res, next) => {
    return res.status(418).json({ msg: 'test' });
})

//express start
const port = process.env.PORT || 5000;
app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log('Servver running on port ' + port);
});


// PARSING BITHDAY FROM XLSX
// let spec="ПП1"
// var workbook = new ExcelJS.Workbook();
// workbook.xlsx.readFile('./data/' + spec + '/birthday.xlsx')
//     .then(function (file, error) {
//         let BDays = {};
//         // console.log(file._worksheets[1]._rows[52]._cells[0]._value.model.value)
//         // console.log(file._worksheets[1]._rows.length)
//         let array = file._worksheets[1]._rows;
//         array.forEach((el) => { 
//             // console.log(el._cells[0]._value.model.value + ' ' + el._cells[1]._value.model.value)
//             // BDays[el._cells[1]._value.model.value] = {}
//             if (BDays[el._cells[1]._value.model.value]) {
//                 BDays[el._cells[1]._value.model.value].push(el._cells[0]._value.model.value);
//             } else {
//                 BDays[el._cells[1]._value.model.value] = [];
//                 BDays[el._cells[1]._value.model.value].push(el._cells[0]._value.model.value);
//             }
//         })
//         // console.log(BDays);
//         // use workbook

//         fs.writeFileSync('./data/' + spec + '/birthday.xlsx', JSON.stringify(BDays, null, 2), function (err, contents) {
//             console.log(err)
//             console.log(contents)
//         });
//     });

// fs.readFile('./data/' + spec + '/timetable.json', 'utf8', function (err, contents) {
//     if (err) {
//         return res.status(500).json(err);
//     }
//     let file = JSON.parse(contents);
//     // console.log(file);
//     for (key in file) {
//         let temp = file[key];
//         delete file[key];
//         let newKey = key.substr(0, 10);
//         file[newKey] = temp;       
//     }
//     console.log(file);
//     fs.writeFileSync('./data/' + spec + '/timetable.json', JSON.stringify(file, null, 2), function (err, contents) {
//                     console.log(err)
//                     console.log(contents)
//                 });

// });