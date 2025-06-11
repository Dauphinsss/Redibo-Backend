const { userModel } = require("../models/users")

class userController {
  static async getUserData(req, res) {
    try {
      const { id } = req.params

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: "El id del usuario debe ser un numero" })
      }

      const usuario = await userModel.getUserData({ id: Number(id) })

      if (!usuario) {
        return res.status(400).json({ error: "No existe el usuario" })
      }

      res.status(200).json(usuario)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }

  static async getUser(req, res) {
    const userId = req.user.id;
    const user = await userModel.getUser({ id: parseInt(userId) })
    if (!user) {
      return res.status(400).json({ error: "No existe el usuario" })
    }
    res.status(200).json(user)
  } catch(error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }
}

module.exports = { userController }
