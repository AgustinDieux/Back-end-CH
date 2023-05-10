const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/users.models.js");
const mongoose = require("mongoose");
const cartDao = require("../dao/cart.dao");

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Usa el campo 'email' como nombre de usuario
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: "Credenciales inválidas" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serializar y deserializar al usuario para mantenerlo en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with id:", id);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return done(null, null);
    }
    const user = await userModel.findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

exports.login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login?error=Credenciales inválidas");
    }
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      // Verifica si el usuario ya tiene un carrito asociado
      if (!user.cart) {
        // Crea un nuevo carrito y asocia el ID con el usuario
        const newCart = await cartDao.create({});
        user.cart = newCart.id;
        await user.save();
      }
      // Redirige al usuario a la ruta '/api/productsdos'
      return res.redirect("/api/productsdos");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      // Manejar el error
      console.error(err);
      return res.redirect("/error");
    }
    req.session.destroy();
    res.redirect("/session");
  });
};

exports.register = async (req, res, next) => {
  try {
    console.log("Recibiendo solicitud de registro:", req.body);
    const { first_name, last_name, email, age, password } = req.body;
    // Crea un hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Contraseña encriptada:", hashedPassword);
    // Crea un nuevo usuario en la base de datos
    const newUser = new userModel({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("Usuario creado:", newUser);
    // Redirige al usuario a la página de inicio de sesión
    res.redirect("/session");
  } catch (err) {
    console.error("Error al registrar al usuario:", err);
    // ... manejo de errores ...
  }
};
