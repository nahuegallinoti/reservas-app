const nodemailer = require('nodemailer');

function enviarEmailRegistroSolicitud (data) {

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
            to: data.destinatario,
            subject: "Solicitud de Reserva de Cabaña",
            html: data.html
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
            to: data.destinatario,
            subject: "Registro de Check In",
            html: data.html        
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

exports.sendMailRegistroCheckInReserva = sendMailRegistroCheckInReserva;
exports.enviarEmailRegistroSolicitud = enviarEmailRegistroSolicitud;