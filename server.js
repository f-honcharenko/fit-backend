const express = require('express');
const bodyPaster = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const e = require('express');
const jwt = require('jsonwebtoken');
const { emitKeypressEvents } = require('readline');
const config = require('config');
const mongoose = require('mongoose');
//MODELS
const user = require('./models/user');
const { time } = require('console');
const block = require('./models/block');
// const day = require('./models/day');
// const block = require('./models/block');
//MODELS
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
    useFindAndModify: false
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
                                    display:
                                        lesson.events ? lesson.events.length > 0 ? "block" : "auto" : "auto",
                                    borderColor:
                                        lesson.events ?
                                            lesson.events[0] ?
                                                lesson.events[0].color ?
                                                    lesson.events[0].color :
                                                    "none" :
                                                "none" :
                                            "none",
                                    backgroundColor:
                                        lesson.events ?
                                            lesson.events[0] ?
                                                lesson.events[0].color ?
                                                    lesson.events[0].color :
                                                    "none" :
                                                "none" :
                                            "none",
                                    url: lesson.link,
                                    extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title, note: lesson.note, events: lesson.events }
                                });
                            } else
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(09, 00),
                                    end: date.setUTCHours(10, 20),
                                    extendedProps: { lessonNumber: number }
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
                                    display:
                                        lesson.events ? lesson.events.length > 0 ? "block" : "auto" : "auto",
                                    borderColor:
                                        lesson.events ?
                                            lesson.events[0] ?
                                                lesson.events[0].color ?
                                                    lesson.events[0].color :
                                                    "none" :
                                                "none" :
                                            "none",
                                    backgroundColor:
                                        lesson.events ?
                                            lesson.events[0] ?
                                                lesson.events[0].color ?
                                                    lesson.events[0].color :
                                                    "none" :
                                                "none" :
                                            "none",
                                    backgroundColor: lesson.backgroundColor,
                                    url: lesson.link,
                                    extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title, note: lesson.note, events: lesson.events }
                                });
                            } else
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(10, 30),
                                    end: date.setUTCHours(11, 50),
                                    extendedProps: { lessonNumber: number }
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
                                    display:
                                        lesson.events ? lesson.events.length > 0 ? "block" : "auto" : "auto",
                                    borderColor:
                                        lesson.events ?
                                            lesson.events[0] ?
                                                lesson.events[0].color ?
                                                    lesson.events[0].color :
                                                    "none" :
                                                "none" :
                                            "none",
                                    backgroundColor:
                                        lesson.events ?
                                            lesson.events[0] ?
                                                lesson.events[0].color ?
                                                    lesson.events[0].color :
                                                    "none" :
                                                "none" :
                                            "none",
                                    url: lesson.link,
                                    backgroundColor: lesson.backgroundColor,
                                    extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title, note: lesson.note, events: lesson.events }

                                });
                            } else
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(12, 10),
                                    end: date.setUTCHours(13, 30),
                                    extendedProps: { lessonNumber: number }
                                });
                            }
                            break;
                        case 4:
                            if (lesson.title != 'none')
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(13, 40),
                                    end: date.setUTCHours(15, 0),
                                    title: lesson.title + '(' + lesson.type + ')',
                                    color: lesson.color,
                                    display:
                                        lesson.events ? lesson.events.length > 0 ? "block" : "auto" : "auto",
                                    borderColor:
                                        lesson.events ?
                                            lesson.events[0] ?
                                                lesson.events[0].color ?
                                                    lesson.events[0].color :
                                                    "none" :
                                                "none" :
                                            "none",
                                    backgroundColor:
                                        lesson.events ?
                                            lesson.events[0] ?
                                                lesson.events[0].color ?
                                                    lesson.events[0].color :
                                                    "none" :
                                                "none" :
                                            "none",
                                    display: lesson.display || "auto",
                                    backgroundColor: lesson.backgroundColor,
                                    url: lesson.link,
                                    extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title, note: lesson.note, events: lesson.events }
                                });
                            } else
                            {
                                BDresponce.push({
                                    start: date.setUTCHours(13, 40),
                                    end: date.setUTCHours(15, 0),
                                    extendedProps: { lessonNumber: number }
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
            console.log('=========');
            console.log(docs);
            console.log('=========');
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
                return res.status(500).json({ msg: err.message, err });
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
                return res.status(500).json({ msg: err.message, err });
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

app.post('/removeEvent', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const number = req.body.lessonNumber;
    const eventPosition = req.body.eventPosition;
    console.log(req.body);
    const date = req.body.date.substr(0, 10);
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Day = require('./models/day')[decoded.spec];
                Day.findOne({ date: date },
                    (errFO, result) => {
                        if (errFO) return console.log(errFO);
                        if (result)
                        {
                            console.log(result.groups[group][number]["events"]);
                            if (result.groups[group][number]["events"])
                            {
                                result.groups[group][number]["events"].splice(eventPosition, 1);
                            } else
                            {
                                return res.status(404).json({ msg: 'events not found' });

                            }
                            console.log(result.groups[group][number]["events"]);

                            Day.updateOne({ date: date }, result, (errUO, resUO) => {
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
    const date = req.body.data.lessonDate.substr(0, 10);
    const editType = req.body.editType;
    const newData = req.body.data;
    console.log(newData);
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Day = require('./models/day')[decoded.spec];

                Day.findOne({ date: date }, (err, resFo) => {
                    if (err) return res.status(500).json({ err: err });
                    if (resFo)
                    {
                        console.log(resFo.groups);
                        console.log(group);
                        // resFo.groups[group][newData.lessonNumber] = newData;
                        resFo.groups[group][number].title = newData.lessonName;
                        resFo.groups[group][number].type = newData.lessonType;
                        resFo.groups[group][number].teacher = newData.lessonTeacher;
                        // resFo.groups[group][number].color = newData.lessonColor;
                        resFo.groups[group][number].link = newData.lessonLink;
                        resFo.groups[group][number].note = newData.lessonNote;
                        console.log('=========================');
                        console.log(resFo.groups[group][number]);

                        console.log('=========================');
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
                return res.status(500).json({ msg: err.message, err });
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
app.post('/addEvent', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const data = req.body.data;
    const date = req.body.date;
    const number = req.body.number;

    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Day = require('./models/day')[decoded.spec];
                Day.findOne({ date: date }, (errFO, resFO) => {
                    if (errFO) return res.status(500).json({ err: errFO });
                    if (resFO)
                    {
                        console.log(resFO.groups[group]);
                        console.log('========');
                        let newEvent = {
                            type: data.type,
                            title: data.title,
                            theme: data.theme,
                            note: data.note,
                        };
                        if (data.type)
                        {
                            newEvent.prefix = data.prefix
                        } else
                        {
                            newEvent.color = data.color;
                        }
                        if (resFO.groups[group][number]["events"])
                        {
                            resFO.groups[group][number]["events"].push(newEvent);
                        } else
                        {
                            resFO.groups[group][number]["events"] = [];
                            resFO.groups[group][number]["events"].push(newEvent);
                        }

                        console.log('1test', resFO.groups[group][number]);
                        Day.updateOne({ date: date }, resFO, (errUO, resUO) => {
                            if (errUO) return res.status(500).json({ err: errUO });
                            console.log(resUO);
                            return res.status(200).json({ msg: resUO });

                        });
                    }
                    else
                    {
                        return res.status(404).json({ err: 'day is not found' });
                    }
                })
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }

})

app.post('/addLessonGrid', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const lessonDate = req.body.date.substr(0, 10);


    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Day = require('./models/day')[decoded.spec];
                Day.findOne({ date: lessonDate }, (errFO, resFO) => {
                    if (errFO) return res.status(500).json({ err: errFO });
                    if (resFO)
                    {
                        resFO.groups[group] = {};
                        resFO.groups[group]["1"] = { title: 'none' };
                        resFO.groups[group]["2"] = { title: 'none' };
                        resFO.groups[group]["3"] = { title: 'none' };
                        resFO.groups[group]["4"] = { title: 'none' };
                        Day.updateOne({ date: lessonDate }, resFO, (errS, resS) => {
                            if (errS) { return res.status(500).json({ err: errS }) }
                            return res.status(200).json({ msg: 'success', resS })
                        });
                    } else
                    {
                        let gridLesson = new Day({
                            date: lessonDate,
                        });
                        gridLesson.groups = {};
                        gridLesson.groups[group] = {};
                        gridLesson.groups[group]["1"] = { title: 'none' };
                        gridLesson.groups[group]["2"] = { title: 'none' };
                        gridLesson.groups[group]["3"] = { title: 'none' };
                        gridLesson.groups[group]["4"] = { title: 'none' };
                        gridLesson.save((errS, resS) => {
                            if (errS) { return res.status(500).json({ err: errS }) }
                            return res.status(200).json({ msg: 'success' })
                        });
                    }
                });
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }

})

app.post('/getBlocks', (req, res, next) => {

    const token = req.body.token;
    const group = req.body.group;
    const weekday = req.body.weekday;

    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Block = require('./models/block')[decoded.spec];
                Block.findOne({ weekday: weekday }, (errFO, resFO) => {
                    if (errFO) return res.status(500).json(errFO);
                    if (resFO)
                    {
                        if (resFO.groups[group])
                        {
                            return res.status(200).json({ 'msg': 'success', data: resFO.groups[group] });
                        }
                    }
                });
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }

})


app.post('/addBlock', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const weekday = req.body.weekDay;
    const block = req.body.data;
    const lessonNumber = req.body.data.lessonNumber;
    delete block["lessonNumber"]
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Block = require('./models/block')[decoded.spec];
                Block.findOne({ weekday }, (errFO, resFO) => {
                    // console.log(errFO);
                    if (errFO) return res.status(500).json(errFO);
                    if (resFO)
                    {
                        if (resFO.groups)
                        {
                            if (resFO.groups[group])
                            {
                                if (resFO.groups[group][lessonNumber])
                                {
                                    resFO.groups[group][lessonNumber].push(block);
                                } else
                                {
                                    resFO.groups[group][lessonNumber] = [];
                                    resFO.groups[group][lessonNumber].push(block);
                                }
                            } else
                            {
                                resFO.groups[group] = {};
                                resFO.groups[group][lessonNumber] = [];
                                resFO.groups[group][lessonNumber].push(block);
                            }
                        } else
                        {
                            resFO.groups = {};
                            resFO.groups[group] = {};
                            resFO.groups[group][lessonNumber] = [];
                            resFO.groups[group][lessonNumber].push(block);
                        }
                        Block.updateOne({ weekday }, resFO, (errUO, resUo) => {
                            if (errUO) { return res.status(500).json({ 'msg': errUO }) };
                            return res.status(200).json({ 'msg': 'ok' });
                        });

                    } else
                    {
                        const Block = require('./models/block')[decoded.spec];
                        let newBlock = {};
                        newBlock.date = new Date();
                        newBlock.weekday = weekday;
                        newBlock.groups = {};
                        newBlock.groups[group] = {};
                        newBlock.groups[group][lessonNumber] = [];
                        newBlock.groups[group][lessonNumber].push(block);
                        Block.insertMany([newBlock], (errS, resS) => {
                            if (errS) { return res.status(500).json({ 'msg': errS }) };
                            return res.status(200).json({ 'msg': 'ok' });

                        });
                    }
                });
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }

})

app.post('/EditBlock', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const weekday = req.body.weekDay;
    const block = req.body.data;
    const lessonNumber = req.body.selectedNumber;
    const selectedArrayEl = req.body.selectedArrayEl;

    console.log(block);
    console.log('============');
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Block = require('./models/block')[decoded.spec];
                Block.findOne({ weekday }, (errFO, resFO) => {
                    // console.log(errFO);
                    if (errFO) return res.status(500).json(errFO);
                    if (resFO)
                    {

                        if (resFO.groups)
                        {
                            if (resFO.groups[group])
                            {
                                if (resFO.groups[group][lessonNumber])
                                {
                                    if (resFO.groups[group][lessonNumber][selectedArrayEl])
                                    {
                                        resFO.groups[group][lessonNumber][selectedArrayEl].lessonName = block.lessonName;
                                        resFO.groups[group][lessonNumber][selectedArrayEl].lessonType = block.lessonType;
                                        resFO.groups[group][lessonNumber][selectedArrayEl].lessonLink = block.lessonLink;
                                        resFO.groups[group][lessonNumber][selectedArrayEl].lessonTeacher = block.lessonTeacher;
                                    } else
                                    {
                                        return res.status(404).json({ msg: 'not found block' });
                                    }
                                } else
                                {
                                    return res.status(404).json({ msg: 'not found lesson' });
                                }
                            } else
                            {
                                return res.status(404).json({ msg: 'not found group' });
                            }
                        } else
                        {
                            return res.status(404).json({ msg: 'not found grid' });
                        }
                        Block.updateOne({ weekday }, resFO, (errUO, resUo) => {
                            if (errUO) { return res.status(500).json({ 'msg': errUO }) };
                            return res.status(200).json({ 'msg': 'ok' });
                        });

                    } else
                    {
                        const Block = require('./models/block')[decoded.spec];
                        let newBlock = {};
                        newBlock.date = new Date();
                        newBlock.weekday = weekday;
                        newBlock.groups = {};
                        newBlock.groups[group] = {};
                        newBlock.groups[group][lessonNumber] = [];
                        newBlock.groups[group][lessonNumber].push(block);
                        Block.insertMany([newBlock], (errS, resS) => {
                            if (errS) { return res.status(500).json({ 'msg': errS }) };
                            return res.status(200).json({ 'msg': 'ok' });

                        });
                    }
                });
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }

})

app.post('/removeBlock', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const weekday = req.body.weekDay;
    const lessonNumber = req.body.selectedNumber;
    const selectedArrayEl = req.body.selectedArrayEl;
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Block = require('./models/block')[decoded.spec];
                Block.findOne({ weekday }, (errFO, resFO) => {
                    // console.log(errFO);
                    if (errFO) return res.status(500).json(errFO);
                    if (resFO)
                    {

                        if (resFO.groups)
                        {
                            if (resFO.groups[group])
                            {
                                if (resFO.groups[group][lessonNumber])
                                {
                                    if (resFO.groups[group][lessonNumber][selectedArrayEl])
                                    {
                                        resFO.groups[group][lessonNumber].splice(selectedArrayEl, 1);
                                    } else
                                    {
                                        return res.status(404).json({ msg: 'not found block' });
                                    }
                                } else
                                {
                                    return res.status(404).json({ msg: 'not found lesson' });
                                }
                            } else
                            {
                                return res.status(404).json({ msg: 'not found group' });
                            }
                        } else
                        {
                            return res.status(404).json({ msg: 'not found grid' });
                        }
                        Block.updateOne({ weekday }, resFO, (errUO, resUo) => {
                            if (errUO) { return res.status(500).json({ 'msg': errUO }) };
                            return res.status(200).json({ 'msg': 'ok' });
                        });

                    } else
                    {
                        const Block = require('./models/block')[decoded.spec];
                        let newBlock = {};
                        newBlock.date = new Date();
                        newBlock.weekday = weekday;
                        newBlock.groups = {};
                        newBlock.groups[group] = {};
                        newBlock.groups[group][lessonNumber] = [];
                        newBlock.groups[group][lessonNumber].push(block);
                        Block.insertMany([newBlock], (errS, resS) => {
                            if (errS) { return res.status(500).json({ 'msg': errS }) };
                            return res.status(200).json({ 'msg': 'ok' });

                        });
                    }
                });
            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }

})


app.post('/generateByBlocks', (req, res, next) => {
    const token = req.body.token;
    const group = req.body.group;
    const weekday = req.body.weekday;
    console.log(req.body);
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
            } else
            {
                const Block = require('./models/block')[decoded.spec];

                if (weekday == 'ALL')
                {
                    let arrWeekDays = [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun",
                    ];
                    let index = 0;

                    Block.find({ weekday: arrWeekDays }, null, { sort: 'критерий сортировки' }, async function (errF, resF) {
                        if (errF) { return res.status(500).json({ err: errF }) }
                        if (resF)
                        {
                            let timetable = {};
                            console.log(resF);
                            resF.forEach((block) => {
                                if (block.groups[group])
                                {
                                    for (number in block.groups[group])
                                    {
                                        const lessons = block.groups[group][number];
                                        lessons.forEach(async (lesson) => {
                                            lesson.lessonDates.forEach(async (date) => {
                                                // console.log(date);
                                                if (timetable[date])
                                                {
                                                    if (timetable[date].groups)
                                                    {
                                                        if (timetable[date].groups[group])
                                                        {
                                                            timetable[date].groups[group][number] = {};
                                                            timetable[date].groups[group][number].title = lesson.lessonName;
                                                            timetable[date].groups[group][number].type = lesson.lessonType;
                                                            timetable[date].groups[group][number].teacher = lesson.lessonTeacher;
                                                            timetable[date].groups[group][number].link = lesson.lessonLink;

                                                        } else
                                                        {
                                                            timetable[date].groups[group] = {};
                                                            for (let i = 1; i <= 4; i++)
                                                            {
                                                                timetable[date].groups[group][i] = {};
                                                                timetable[date].groups[group][i].title = 'none';
                                                            }
                                                            timetable[date].groups[group][number].title = lesson.lessonName;
                                                            timetable[date].groups[group][number].type = lesson.lessonType;
                                                            timetable[date].groups[group][number].teacher = lesson.lessonTeacher;
                                                            timetable[date].groups[group][number].link = lesson.lessonLink;
                                                        }
                                                    } else
                                                    {
                                                        timetable[date].groups = {}
                                                        timetable[date].groups[group] = {};
                                                        for (let i = 1; i <= 4; i++)
                                                        {
                                                            timetable[date].groups[group][i] = {};
                                                            timetable[date].groups[group][i].title = 'none';
                                                        }
                                                        timetable[date].groups[group][number].title = lesson.lessonName;
                                                        timetable[date].groups[group][number].type = lesson.lessonType;
                                                        timetable[date].groups[group][number].teacher = lesson.lessonTeacher;
                                                        timetable[date].groups[group][number].link = lesson.lessonLink;
                                                    }
                                                } else
                                                {
                                                    timetable[date] = {}
                                                    timetable[date].groups = {}
                                                    timetable[date].groups[group] = {};
                                                    for (let i = 1; i <= 4; i++)
                                                    {
                                                        timetable[date].groups[group][i] = {};
                                                        timetable[date].groups[group][i].title = 'none';
                                                    }
                                                    timetable[date].groups[group][number].title = lesson.lessonName;
                                                    timetable[date].groups[group][number].type = lesson.lessonType;
                                                    timetable[date].groups[group][number].teacher = lesson.lessonTeacher;
                                                    timetable[date].groups[group][number].link = lesson.lessonLink;
                                                }
                                            })
                                        });
                                    }
                                }
                            });
                            const Day = require('./models/day')[decoded.spec];
                            let dates = Object.keys(timetable).sort();
                            let timetableArray = [];
                            let insertsArray = [];

                            console.log('====================');
                            console.log('====================');

                            // Day.find({ dates }, async (errIM, resIM) => {
                            //     if (errIM) { return res.status(500).json({ err: errIM }) }
                            //     // return res.status(200).json({ msg: 'Success!' })
                            //     console.log('asd', resIM.length);
                            // });
                            // Day.find({ dates }, (errF, resF) => {
                            //     if (errF) throw (errF);
                            //     console.log(resF.length);
                            // })

                            console.log('00000000000000000000000000')
                            for (date in timetable)
                            {
                                let date1 = date;
                                await Day.findOne({ date }, (errFO, resFO) => {
                                    if (errFO) throw (errFO)
                                    if (resFO)
                                    {
                                        // console.log('FINDED:', resFO);
                                        // console.log('found by daye: ' + date1)
                                        // console.log('FINDED', resFO.groups);
                                        // console.log('==========', group);
                                        if (resFO.groups)
                                        {
                                            if (resFO.groups[group])
                                            {
                                                resFO.groups[group] = timetable[date1].groups[group];
                                            } else
                                            {
                                                resFO.groups[group] = {};
                                                resFO.groups[group] = timetable[date1].groups[group];
                                            }
                                        } else
                                        {
                                            resFO.groups = {};
                                            resFO.groups[group] = {};
                                            resFO.groups[group] = timetable[date1].groups[group];
                                        }



                                        // console.log('==========');
                                        // console.log('UPDATED', resFO.groups);

                                        // resFO.save();
                                        Day.findOneAndUpdate({ date: date1 }, resFO, (errUO2, ressUO2) => {
                                            if (errUO2) console.log(errUO2);
                                            // if (ressUO2) console.log('UPDATED: ', group, date1);
                                            if (ressUO2) console.log(ressUO2);
                                        });
                                    } else
                                    {
                                        let newDay = new Day();
                                        newDay.date = new Date(date1);
                                        newDay.groups = {};
                                        newDay.groups[group] = {};
                                        newDay.groups[group] = timetable[date1].groups[group];
                                        newDay.save((errs, ress) => {
                                            // if (errs) return console.log(errs);
                                            if (ress) return console.log('CREATED');
                                        });
                                        // insertsArray.push(newDay);
                                    }
                                });
                                // console.log('IAL', insertsArray);
                            }

                            // console.log(timetable);
                            // Day.find({ date: dates }, (errF, resF) => {
                            //     if (errF) return res.status(500).json({ err: errF });
                            //     if (resF)
                            //     {
                            //         resF.forEach((el) => {
                            //             let BDdate = el.date;
                            //             console.log('=================');
                            //             console.log(el);
                            //             console.log(BDdate);
                            //             console.log(timetable[BDdate]);
                            //             if (timetable[el.date + ''] == undefined)
                            //             {
                            //                 console.log('+');
                            //             } else
                            //             {
                            //                 console.log('-');

                            //             }
                            // if (el.groups)
                            // {
                            //     if (el.groups[group])
                            //     {
                            //         el.groups[group] = timetable[el.date].groups[group];
                            //     } else
                            //     {
                            //         el.groups[group] = {};
                            //         el.groups[group] = timetable[el.date].groups[group];
                            //     }
                            // } else
                            // {
                            //     el.groups = {};
                            //     el.groups[group] = {};
                            //     el.groups[group] = timetable[el.date].groups[group];
                            // }

                            // });
                            // Day.updateMany({ date: dates }, { groups: resF.groups }, (errS, resS) => {
                            //     // console.log(errS, resS);
                            // });
                            // console.log(resF);
                            // console.log(resF.length);
                            // Object.ass
                            // resF.forEach((el) => { 
                            //     el.groups[group]
                            // })
                            // }
                            // })
                            // ПЕРЕДЕЛАТЬ

                            // let insertsArray = [];
                            // for (date in timetable)
                            // {

                            //     Day.findOne({ date }, (errFO, resFO) => {
                            //         if (errFO) console.log(errFO)
                            //         if (resFO)
                            //         {
                            //             // console.log('FINDED', resFO.groups[group]);
                            //             resFO.groups[group] = { title: 'none' };
                            //             console.log('edited', resFO.groups[group]);
                            //             Day.updateOne({ date: date }, { groups: resFO.groups }, (errS, resS) => {
                            //                 console.log(resS);
                            //                 // if (errS) { return res.status(500).json({ err: errS }) }
                            //                 // return res.status(200).json({ msg: 'success', resS })
                            //             });
                            //         }
                            //     });
                            // };
                            // ПЕРЕДЕЛАТЬ
                            // Day.find({ dates }, async (errIM, resIM) => {
                            //     if (errIM) { return res.status(500).json({ err: errIM }) }
                            //     // return res.status(200).json({ msg: 'Success!' })
                            //     console.log(resIM.length);
                            // });
                            // Day.updateMany({dates}, timetableArray, { upsert: true }, (errIM, resIM) => {
                            //     if (errIM) { return res.status(500).json({ err: errIM }) }
                            //     return res.status(200).json({ msg: 'Success!' })
                            // });
                        }
                    }
                    );


                    // Cycle().then(() => {
                    //     console.log(Object.keys(timetable));
                    //     
                    // })



                } else
                {
                    let timetable = {};
                    let dates = {}
                    Block.findOne({ weekday }, null, { sort: 'критерий сортировки' }, function (errF, resF) {
                        if (errF) { return res.status(500).json({ err: errF }) };
                        if (resF)
                        {
                            if (resF.groups[group])
                            {
                                for (number in resF.groups[group])
                                {
                                    const lessons = resF.groups[group][number];
                                    lessons.forEach((lesson) => {
                                        lesson.lessonDates.forEach((date) => {
                                            // console.log(date);
                                            if (timetable[date])
                                            {
                                                if (timetable[date].groups)
                                                {
                                                    if (timetable[date].groups[group])
                                                    {
                                                        timetable[date].groups[group][number] = {};
                                                        timetable[date].groups[group][number].title = lesson.lessonName;
                                                        timetable[date].groups[group][number].type = lesson.lessonType;
                                                        timetable[date].groups[group][number].teacher = lesson.lessonTeacher;
                                                        timetable[date].groups[group][number].link = lesson.lessonLink;

                                                    } else
                                                    {
                                                        timetable[date].groups[group] = {};
                                                        for (let i = 1; i <= 4; i++)
                                                        {
                                                            timetable[date].groups[group][i] = {};
                                                            timetable[date].groups[group][i].title = 'none';
                                                        }
                                                        timetable[date].groups[group][number].title = lesson.lessonName;
                                                        timetable[date].groups[group][number].type = lesson.lessonType;
                                                        timetable[date].groups[group][number].teacher = lesson.lessonTeacher;
                                                        timetable[date].groups[group][number].link = lesson.lessonLink;
                                                    }
                                                } else
                                                {
                                                    timetable[date].groups = {}
                                                    timetable[date].groups[group] = {};
                                                    for (let i = 1; i <= 4; i++)
                                                    {
                                                        timetable[date].groups[group][i] = {};
                                                        timetable[date].groups[group][i].title = 'none';
                                                    }
                                                    timetable[date].groups[group][number].title = lesson.lessonName;
                                                    timetable[date].groups[group][number].type = lesson.lessonType;
                                                    timetable[date].groups[group][number].teacher = lesson.lessonTeacher;
                                                    timetable[date].groups[group][number].link = lesson.lessonLink;
                                                }
                                            } else
                                            {
                                                timetable[date] = {}
                                                timetable[date].groups = {}
                                                timetable[date].groups[group] = {};
                                                for (let i = 1; i <= 4; i++)
                                                {
                                                    timetable[date].groups[group][i] = {};
                                                    timetable[date].groups[group][i].title = 'none';
                                                }
                                                timetable[date].groups[group][number].title = lesson.lessonName;
                                                timetable[date].groups[group][number].type = lesson.lessonType;
                                                timetable[date].groups[group][number].teacher = lesson.lessonTeacher;
                                                timetable[date].groups[group][number].link = lesson.lessonLink;
                                            }
                                        })

                                    });


                                }
                                let timetableArray = [];
                                const Day = require('./models/day')[decoded.spec];
                                for (date in timetable)
                                {
                                    let newDay = new Day({
                                        date,
                                        groups: timetable[date].groups
                                    });
                                    timetableArray.push(newDay);
                                };
                                Day.find({ date }, (errR, resR) => {
                                    console.log(errR, resR);
                                });

                                // Day.insertMany(timetableArray, (errIM2, resIM2) => {
                                //     if (errIM2) { return res.status(500).json({ err: errIM2 }) }
                                //     return res.status(200).json({ msg: 'Success!' })
                                // });

                            } else
                            {
                                return res.status(404).json({ msg: 'блоки для этой группы в этот день недели не найдены' })
                            }
                        } else
                        {
                            return res.status(404).json({ msg: 'блоки на этот день недели не найдены' });
                        }
                    }
                    );
                }

            }
        });
    } else
    {
        return res.status(405).json({ msg: 'token not sended', });
    }


});



app.post('/get/options', (req, res, next) => {
    const token = req.body.token;
    if (token)
    {
        jwt.verify(token, privateJwtKey, function (err, decoded) {
            if (err)
            {
                return res.status(500).json({ msg: err.message, err });
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
            if (docs.groups[group])
            {
                console.log(docs.groups[group]);
                return res.status(200).json({ msg: 'success', day: docs.groups[group] })

            } else
            {
                return res.status(404).json({ msg: 'group is not found.' })

            }
        } else
        {
            return res.status(404).json({ msg: 'day table is not found.' })
        }
    });
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





// fs.readFile('./data/ИПЗ-3/timetable.json', 'utf8', function (err, contents) {
//     if (err)
//     {
//         return console.log(err);
//     }
//     let file = JSON.parse(contents);

//     for (key in file)
//     {

//         let date = new Date(key);
//         date.setUTCDate(date.getUTCDate() + 1);
//         date.setUTCHours(0, 0);
//         // date = date.substr(0, 10)
//         console.log(date);
//         const Day = require('./models/day').SoftEng3;
//         let candidate = new Day({
//             groups: file[key],
//             date: date
//         });
//         candidate.save();


//         //     for (key2 in file[key])
//         //     {
//         //         if (!file[key][key2]["1"]) { file[key][key2]["1"] = {}; file[key][key2]["1"].title = 'none' }
//         //         if (!file[key][key2]["2"]) { file[key][key2]["2"] = {}; file[key][key2]["2"].title = 'none' }
//         //         if (!file[key][key2]["3"]) { file[key][key2]["3"] = {}; file[key][key2]["3"].title = 'none' }
//         //         if (!file[key][key2]["4"]) { file[key][key2]["4"] = {}; file[key][key2]["4"].title = 'none' }


//         //     }
//         // };
//         // fs.writeFile('./data/ИПЗ-3/timetable.json', JSON.stringify(file, null, 2), function (err, contents) {
//         //     console.log(err, contents);
//         //     if (err) return console.log(err);
//         //     return console.log('OK');
//         // });

//     }
// });



// let userCandidate = new user({
//     login: "kosvanya",
//     type: "user",
//     password: "123456789",
//     spec: 'SoftEng1',
//     groups: ["ИПЗ-31/1", "ИПЗ-31/2"]
// });
// userCandidate.save();

// const Day = require('./models/day').AP1;
// Day.insertMany([
//     { date: '11-01-2003' },
//     { date: '11-02-2003' },
//     { date: '11-03-2003' },
// ]);

// const Day = require('./models/day').SoftEng3;
// Day.find({
//     $where: (el) => {
//         if (el.date = '2020-09-07T00:00:00.000+00:00')
//         {
//             return true
//         }
//     }
// }, (err, res) => {
//     console.log(err, res);
// })
