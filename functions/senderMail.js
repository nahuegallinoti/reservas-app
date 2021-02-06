const nodemailer = require('nodemailer');

function sendMailRegistroReserva (data) {

    return new Promise(function (resolve, reject) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tesisanalista2020@gmail.com',
                pass: 'tesis2020.'
            }
        });
        const mailOptions = {
            from: 'Complejo de Cabañas',
            to: data.dest, // Destinatario
            subject: "Solicitud de Reserva de su Cabaña",
            html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
            <br />
            <img src="https://media.cnnchile.com/sites/2/2020/04/rick_y_morty_7132_1570805482-740x430.jpg" />
        `
        };

        try {
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    reject("Ocurrió un error al intentar enviar el mail: " + err.message);
                else
                    resolve("Se envió correctamente el mail");
            });

        }
        catch (err) {
            throw err;
        }
    })
};

function sendMailRegistroCheckInReserva (data) {

    console.log(data);
    return new Promise(function (resolve, reject) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tesisanalista2020@gmail.com',
                pass: 'tesis2020.'
            }
        });
        const mailOptions = {
            from: 'Complejo de Cabañas',
            to: data.dest, // Destinatario
            subject: "Solicitud de Reserva de su Cabaña",
            html: `<p style="font-size: 16px;">Pickle Rick!!</p>
            <br />
            <img src="https://media.cnnchile.com/sites/2/2020/04/rick_y_morty_7132_1570805482-740x430.jpg" />
        `
        };

        try {
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    reject("Ocurrió un error al intentar enviar el mail: " + err.message);
                else
                    resolve("Se envió correctamente el mail");
            });

        }
        catch (err) {
            throw err;
        }
    })
};

exports.sendMailRegistroReserva = sendMailRegistroReserva;
exports.sendMailRegistroCheckInReserva = sendMailRegistroCheckInReserva;