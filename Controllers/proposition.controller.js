import * as PropositionService from '../service/propostion.service.js'
import haversine from 'haversine'

export const addProposition = async (req, res) => {
    const { currentUser } = res.locals
    try {
        const proposition = await PropositionService.addProposition(
            currentUser?._id,
            req.body.propostiondDate,
            req.body.mates
        )
        res.status(200).send(proposition)
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack })
    }
}

export const getPropositions = async (req, res) => {
    try {
        const proposition = await PropositionService.getProposition()
        if (!proposition) {
            throw new Error('Proposition not found')
        }
        res.status(200).json(proposition)
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack })
    }
}

export const updateProposition = async (req, res) => {
    try {
        const proposition = await PropositionService.updateProposition(
            req.params.id,
            req.body
        )
        res.status(200).send(proposition)
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack })
    }
}

export const getProposition = async (req, res) => {
    try {
        const proposition = await PropositionService.getPropositionById(
            req.params.id
        )
        if (!proposition) {
            throw new Error('proposition not found')
        }
        res.send(proposition)
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack })
    }
}

export const deleteProposition = async (req, res) => {
    const id = req.params.id
    try {
        await PropositionService.deleteProposition(id)
        res.status(200).json({ message: 'Proposition deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack })
    }
}

export const getPropositionsByLocation = async (req, res) => {
    try {
        const userLocation = req.body.userLocation
        const proposition = await getPropositions()
        console.log(proposition)
        console.log(userLocation)
        const propositionsByLocation = proposition.filter((proposition) => {
            const propositionLocation = {
                latitude: proposition.latitude,
                longitude: proposition.longitude,
            }
            const distance = haversine(userLocation, propositionLocation, {
                unit: 'meter',
            })
            res.send(distance < 10000)
        })
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack })
    }
}
