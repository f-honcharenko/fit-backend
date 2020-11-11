const express = require('express');
const bodyPaster = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const e = require('express');
const jwt = require('jsonwebtoken');
const { emitKeypressEvents } = require('readline');
const config = require('config');
const mongoose = require('mongoose');
const user = require('./models/user');
const { group } = require('console');
// 
// const day = require('./models/day');

// const ExcelJS = require('exceljs');
// 
const privateJwtKey = config.jwt.secret;

const app = express();
app.use(cors());
app.use(bodyPaster.json());
app.use(bodyPaster.urlencoded({ extended: false }));

mongoose.connect(config.mongoose.link, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // useFindAndModify: false
});

//routes
app.post('/timetables/1/add', (req, res, next) => {
    let data = req.body;
    const spec = 'ИПЗ-3';
    // const token = req.body.token;
    //read the timуеtable
    fs.readFile('./data/' + spec + '/timetable.json', 'utf8', function (err, contents) {
        if (err)
        {
            return res.status(500).json(err);
        }
        let file = JSON.parse(contents);
        //pasrsing
        data.lessonDate.forEach(element => {
            element = element.substr(0, 10)
            if (file[element])
            {
                data.lessonGroup.forEach(group => {
                    let tempData = data.lessonTime;
                    if (file[element][group])
                    {
                        if (file[element][group][data.lessonTime])
                        {
                            file[element][group][data.lessonTime].title = data.lessonName;
                            file[element][group][data.lessonTime].type = data.lessonType;
                            file[element][group][data.lessonTime].teacher = data.lessonTeacher;
                            file[element][group][data.lessonTime].color = data.lessonColor;
                            file[element][group][data.lessonTime].link = data.lessonLink;
                        } else
                        {
                            file[element][group][data.lessonTime] = {};
                            file[element][group][data.lessonTime].title = data.lessonName;
                            file[element][group][data.lessonTime].type = data.lessonType;
                            file[element][group][data.lessonTime].teacher = data.lessonTeacher;
                            file[element][group][data.lessonTime].color = data.lessonColor;
                            file[element][group][data.lessonTime].link = data.lessonLink;
                        }
                    } else
                    {
                        file[element][group] = {};
                        file[element][group][data.lessonTime] = {};
                        file[element][group][data.lessonTime].title = data.lessonName;
                        file[element][group][data.lessonTime].type = data.lessonType;
                        file[element][group][data.lessonTime].teacher = data.lessonTeacher;
                        file[element][group][data.lessonTime].color = data.lessonColor;
                        file[element][group][data.lessonTime].link = data.lessonLink;
                    }
                });
            } else
            {
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
    let counter = 0;
    const group = req.body.group;
    const dateStart = req.body.start.substr(0, 10);
    const spec = req.body.spec;
    const year = new Date(new Date(dateStart).setDate(new Date(dateStart).getDate() + 15)).getFullYear();
    const dateEnd = req.body.end.substr(0, 10);
    let responce = [];

    let BDresponce = [];
    // СДЕЛАТЬ ВЫБОРКУ ТОЛЬКО ОДНОЙ ГРУППЫ НАПРЯМУЮ ИЗ БД!!!!!!!

    //read the timetable;
    fs.readFile('./data/' + spec + '/timetable.json', 'utf8', function (err, contents) {
        if (err)
        {
            return res.status(500).json(err);
        }
        let file = JSON.parse(contents);
        for (key in file)
        {
            let date1 = new Date(key);
            if ((key >= dateStart) && (key <= dateEnd))
            {
                for (number in file[key][group])
                {
                    let date = new Date(key);
                    date.setDate(date.getDate() + 1);


                    switch (Number(number))
                    {
                        case 1:
                            if (file[key][group][number].title != 'none')
                            {
                                responce.push({
                                    start: date.setUTCHours(09, 00),
                                    end: date.setUTCHours(10, 20),
                                    display: file[key][group][number].display || "auto",
                                    // backgroundColor: "red",
                                    title: file[key][group][number].title + '(' + file[key][group][number].type + ')',
                                    color: file[key][group][number].color,
                                    url: file[key][group][number].link,
                                    extendedProps: { teacher: file[key][group][number].teacher, lessonNumber: number, date: key }
                                });
                            } else
                            {
                                responce.push({
                                    start: date.setUTCHours(09, 00),
                                    end: date.setUTCHours(10, 20),
                                });
                            }
                            break;
                        case 2:
                            if (file[key][group][number].title != 'none')
                            {
                                responce.push({
                                    start: date.setUTCHours(10, 30),
                                    end: date.setUTCHours(11, 50),
                                    title: file[key][group][number].title + '(' + file[key][group][number].type + ')',
                                    color: file[key][group][number].color,
                                    url: file[key][group][number].link,
                                    extendedProps: { teacher: file[key][group][number].teacher, lessonNumber: number, date: key }
                                });
                            } else
                            {
                                responce.push({
                                    start: date.setUTCHours(10, 30),
                                    end: date.setUTCHours(11, 50),
                                });
                            }
                            break;
                        case 3:
                            if (file[key][group][number].title != 'none')
                            {
                                responce.push({
                                    start: date.setUTCHours(12, 10),
                                    end: date.setUTCHours(13, 30),
                                    title: file[key][group][number].title + '(' + file[key][group][number].type + ')',
                                    color: file[key][group][number].color,
                                    url: file[key][group][number].link,
                                    extendedProps: { teacher: file[key][group][number].teacher, lessonNumber: number, date: key }
                                });
                            } else
                            {
                                responce.push({
                                    start: date.setUTCHours(12, 10),
                                    end: date.setUTCHours(13, 30),
                                });
                            }
                            break;
                        case 4:
                            if (file[key][group][number].title != 'none')
                            {
                                responce.push({
                                    start: date.setUTCHours(12, 10),
                                    end: date.setUTCHours(13, 30),
                                    title: file[key][group][number].title + '(' + file[key][group][number].type + ')',
                                    color: file[key][group][number].color,
                                    url: file[key][group][number].link,
                                    extendedProps: { teacher: file[key][group][number].teacher, lessonNumber: number, date: key }
                                });
                            } else
                            {
                                responce.push({
                                    start: date.setUTCHours(13, 40),
                                    end: date.setUTCHours(15, 00),
                                });
                            }
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
            for (key in file)
            {
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

app.post('/timetables/2/getCal', (req, res, next) => {
    let counter = 0;
    const group = req.body.group;
    const dateStart = req.body.start.substr(0, 10);
    const spec = req.body.spec;
    const year = new Date(new Date(dateStart).setDate(new Date(dateStart).getDate() + 15)).getFullYear();
    const dateEnd = req.body.end.substr(0, 10);



    const Day = require('./models/day')[spec];
    // СДЕЛАТЬ ВЫБОРКУ ТОЛЬКО ОДНОЙ ГРУППЫ НАПРЯМУЮ ИЗ БД!!!!!!!
    Day.find({ date: { $gte: dateStart, $lte: dateEnd } }, (err, docs) => {
        let BDresponce = [];

        if (err)
        {
            return res.status(500).json(err);
        }
        if (docs)
        {
            docs.forEach((el) => {
                for (number in el.groups[group])
                {
                    let date = el.date;
                    // console.log(el.groups[group][number].title);
                    let lesson = el.groups[group][number];
                    switch (Number(number))
                    {
                        case 1:
                            if (lesson.title != 'none')
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(09, 00),
                                    end: date.setUTCHours(10, 20),
                                    title: lesson.title + '(' + lesson.type + ')',
                                    color: lesson.color,
                                    display: lesson.display || "auto",
                                    url: lesson.link,
                                    extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title }
                                });
                            } else
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(09, 00),
                                    end: date.setUTCHours(10, 20),
                                });
                            }
                            break;
                        case 2:
                            if (lesson.title != 'none')
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(10, 30),
                                    end: date.setUTCHours(11, 50),
                                    display: lesson.display || "auto",
                                    title: lesson.title + '(' + lesson.type + ')',
                                    color: lesson.color,
                                    backgroundColor: lesson.backgroundColor,
                                    url: lesson.link,
                                    extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title }
                                });
                            } else
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(10, 30),
                                    end: date.setUTCHours(11, 50),
                                });
                            }
                            break;
                        case 3:
                            if (lesson.title != 'none')
                            {
                                BDresponce.push({
                                    display: lesson.display || "auto",
                                    start: date.setUTCHours(12, 10),
                                    end: date.setUTCHours(13, 30),
                                    title: lesson.title + '(' + lesson.type + ')',
                                    color: lesson.color,
                                    url: lesson.link,
                                    backgroundColor: lesson.backgroundColor,
                                    extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title }

                                });
                            } else
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(12, 10),
                                    end: date.setUTCHours(13, 30),
                                });
                            }
                            break;
                        case 4:
                            if (lesson.title != 'none')
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(12, 10),
                                    end: date.setUTCHours(13, 30),
                                    title: lesson.title + '(' + lesson.type + ')',
                                    color: lesson.color,
                                    display: lesson.display || "auto",
                                    backgroundColor: lesson.backgroundColor,
                                    url: lesson.link,
                                    extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title }
                                });
                            } else
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(13, 40),
                                    end: date.setUTCHours(15, 00),
                                });

                            }
                            break;
                        default:
                            break;
                    }
                    // 
                }
            });
            // console.log(BDresponce);
            return res.status(200).json(BDresponce);
        } else
        {
            return console.log('docs not found');
        };
    })
});


app.post('/authAdmin', (req, res, next) => {
    const candidate = {
        login: req.body.login,
        password: req.body.password
    };
    user.findOne({ login: candidate.login }, {}, (err, docs) => {
        if (err) return res.status(500).json({ err });
        if (docs)
        {
            //Добавить шифрование
            if (docs.password == candidate.password)
            {
                jwt.sign({
                    login: docs.login,
                    type: docs.type,
                    groups: docs.groups,
                    spec: docs.spec,
                    id: docs.id
                },
                    privateJwtKey,
                    { expiresIn: '1h' },
                    (errT, token) => {
                        if (err) return res.status(500).json({ msg: 'server jwt gen error', errT })
                        return res.status(200).json({ msg: 'login succses', JWT: token });
                    });
            } else
            {
                return res.status(401).json({ msg: 'password is wrong' });
            }
        } else
        {
            return res.status(404).json({ msg: 'user not found' });
        }
        console.log(docs);
    })
})

app.post('/lk', (req, res, next) => {
    const token = req.body.token;
    // console.log(token);
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else
            {
                return res.status(200).json({ msg: 'success', decoded });
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }
})

app.post('/removeLesson', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const number = req.body.lessonNumber;
    const date = req.body.date.substr(0, 10);
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else
            {
                const Day = require('./models/day')[decoded.spec];
                Day.findOne({ date: date },
                    (errFO, result) => {
                        if (errFO) return console.log(errFO);
                        if (result)
                        {
                            result.groups[group][number] = {};
                            result.groups[group][number].title = 'none';
                            Day.updateOne({ date: date }, { groups: result.groups }, (errUO, resUO) => {
                                if (errUO) return res.status(500).json({ err: errUO });
                                return res.status(200).json({ msg: resUO });

                            });
                        } else
                        {
                            return res.status(404).json({ msg: 'docs not found' });
                        }
                    })
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }
})

app.post('/editLesson', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const number = req.body.data.lessonNumber;
    console.log(req.body.data);
    const date = req.body.data.lessonDate.substr(0, 10);
    const editType = req.body.editType;
    const newData = req.body.data;
    console.log(newData);
    // console.log(newData);
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else
            {
                const Day = require('./models/day')[decoded.spec];

                Day.findOne({ date: date }, (err, resFo) => {
                    if (err) return res.status(500).json({ err: err });
                    if (resFo)
                    {
                        // resFo.groups[group][newData.lessonNumber] = newData;
                        resFo.groups[group][number].title = newData.lessonName;
                        resFo.groups[group][number].type = newData.lessonType;
                        resFo.groups[group][number].teacher = newData.lessonTeacher;
                        // resFo.groups[group][number].color = newData.lessonColor;
                        resFo.groups[group][number].link = newData.lessonLink;
                        Day.updateOne({ date: date }, resFo, (errUO, resUO) => {
                            if (errUO) return res.status(500).json({ err: errUO });
                            return res.status(200).json({ msg: resUO });
                        });
                    } else
                    {
                        return res.status(404).json({ msg: 'not found' });
                    }
                });
                // fs.readFile('./data/' + decoded.spec + '/timetable.json', 'utf8', function (err, contents) {
                //     if (err) {
                //         return res.status(500).json(err);
                //     }
                //     let file = JSON.parse(contents);
                //     console.log('date :', date);
                //     console.log('group :', group);
                //     console.log('number :', number);
                //     switch (editType) {
                //         case 'title':
                //             file[date][group][number].title = newData.lessonName;
                //             file[date][group][number].type = newData.lessonType;
                //             break;
                //         case 'teacher':
                //             file[date][group][number].teacher = newData.lessonTeacher;
                //             break;
                //         case 'link':
                //             console.log(file[date][group][number]);
                //             file[date][group][number].link = newData.lessonLink;
                //             console.log(file[date][group][number]);
                //             break;
                //         default:
                //             return res.status(400).json({ err: 'NOTFOUNDTYPE' });
                //             break;
                //     }
                //     // file[date][group][number]

                //     fs.writeFileSync('./data/' + decoded.spec + '/timetable.json', JSON.stringify(file, null, 2), function (err, contents) {
                //         if (err) {
                //             return res.status(500).json(err)
                //         } else {
                //             return res.status(200).json('DELETED')

                //         }

                //     });

                // });
                // return res.status(200).json({ msg: 'success', decoded });
            }
        });
    } else
    {
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

    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else
            {
                const Day = require('./models/day')[decoded.spec];
                Day.findOne({ date: lessonDate }, (errFO, resFO) => {
                    if (errFO) return res.status(500).json({ err: errFO });
                    if (resFO)
                    {
                        console.log(resFO.groups[group]);
                        resFO.groups[group][lessonNumber] = {};
                        resFO.groups[group][lessonNumber] = {
                            title: lessonName,
                            type: lessonType,
                            teacher: lessonTeacher,
                            link: lessonLink,
                        }
                        Day.updateOne({ date: lessonDate }, { groups: resFO.groups }, (errUO, resUO) => {
                            if (errUO) return res.status(500).json({ err: errUO });
                            return res.status(200).json({ msg: resUO });

                        });
                    }
                    else
                    {
                        return res.status(404).json({ err: 'not found' });
                    }
                })
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }

})






app.post('/get/options', (req, res, next) => {
    const token = req.body.token;
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: 'server jwt parse error', err });
            } else
            {
                fs.readFile('./data/options.json', 'utf8', function (err, contents) {
                    if (err)
                    {
                        return res.status(500).json(err);
                    }
                    let file = JSON.parse(contents);
                    return res.status(200).json({ msg: 'success', file });
                });
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }
})

app.post('/get/oneDay', (req, res, next) => {
    const spec = req.body.spec;
    const group = req.body.group;
    let date = req.body.date.substr(0, 10)
    const Day = require('./models/day')[spec];
    Day.findOne({ date: date }, (err, docs) => {
        if (err) return console.log(err);
        if (docs)
        {
            return res.status(200).json({ msg: 'success', day: docs.groups[group] })
        } else
        {
            return console.log('404 nor found');
        }
    });

    // fs.readFile('./data/' + spec + '/timetable.json', 'utf8', function (err, contents) {
    //     if (err) {
    //         return res.status(500).json(err);
    //     }
    //     let file = JSON.parse(contents);
    //     try {
    //         file = file[date][group]
    //         return res.status(200).json({ msg: 'success', day: file });
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ msg: 'Вероятно, на эту дату нет занятий...', err: '123' });
    //     }
    // });

})


app.post('/ping', (req, res, next) => {
    return res.status(200).json({ msg: 'pong' });
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





// fs.readFile('./data/ПП1/timetable.json', 'utf8', function (err, contents) {
//     if (err) {
//         return res.status(500).json(err);
//     }
//     let file = JSON.parse(contents);

//     for (key in file) {
//         for (key2 in file[key]) {
//             // console.log(key2);
//             if (!file[key][key2]["1"]) { file[key][key2]["1"] = {}; file[key][key2]["1"].title = 'none' }
//             if (!file[key][key2]["2"]) { file[key][key2]["2"] = {}; file[key][key2]["2"].title = 'none' }
//             if (!file[key][key2]["3"]) { file[key][key2]["3"] = {}; file[key][key2]["3"].title = 'none' }
//             if (!file[key][key2]["4"]) { file[key][key2]["4"] = {}; file[key][key2]["4"].title = 'none' }



//         }
//     };
//     fs.writeFile('./data/ПП1/timetable.json', JSON.stringify(file, null, 2), function (err, contents) {
//         console.log(err, contents);
//         if (err) return console.log(err);
//         return console.log('OK');
//     });

// });



// let userCandidate = new user({
//     login: "lifipp",
//     type: "user",
//     password: "123456789",
//     spec: 'AP1',
//     groups: ["ПП11/1", "ПП11/2", "ПП12/1", "ПП12/2"]
// });
// const Day = require('./models/day').AP1;

// Day.findOne({ date: '2020-09-17' }, (err, saveRes) => {
//     if (err) {
//         console.log(err);
//     } else {
//         group1 = 'ПП11/1';
//         number1 = 2;
//         console.log(saveRes.groups[group1][number1]);

//         saveRes.groups[group1] = {};
//         // saveRes.groups[group1][number1].title = 'none';
//         console.log(saveRes.groups[group1]);
//         saveRes.save();
//         // saveRes.remove();
//         // saveRes.login = 'lifipp'
//         // saveRes.save();
//     }
// });