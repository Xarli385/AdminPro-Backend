const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')
    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarMedico = async (req, res = response) => {
    try {

        const id = req.params.id;
        const uid = req.uid;

        //const hospitalId = req.params.hospital;

        const medico = await Medico.findById( id );
        //const hospital = await Hospital.findById( hospitalId );

        if (!medico){
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por Id'
            })

        }/* else if (!hospital){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })

        }
 */


        //medico.id = req.body.id;


        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate ( id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        })
        
    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }
}

const borrarMedico = async (req, res = response) => {
    try {

        const id = req.params.id;

        const medico = await Medico.findById( id );

        if (!medico){
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por Id'
            })

        }    

        await Medico.findByIdAndDelete ( id );

        res.json({
            ok: true,
            msg: 'Médico Eliminado'
        })
        
    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}