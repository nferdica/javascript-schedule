const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contato = null;
    }

    async register() {
        this.validate();
        if (this.errors.length) return;
        this.contato = await ContatoModel.create(this.body);
    }

    async edit(id) {
        if (!this.isValidId(id)) return;
        this.validate();
        if (this.errors.length) return;
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
    }

    validate() {
        this.cleanUp();
        this.validateEmail();
        this.validatePhoneNumber();
        this.validateRequiredFields();
        this.validateContactPresence();
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
        };
    }

    validateEmail() {
        if (this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }
    }

    validatePhoneNumber() {
        if (this.body.telefone && !this.isValidPhoneNumber(this.body.telefone)) {
            this.errors.push('Número de telefone inválido');
        }
    }

    validateRequiredFields() {
        if (!this.body.nome) {
            this.errors.push('Nome é um campo obrigatório');
        }
    }

    validateContactPresence() {
        if (!this.body.telefone && !this.body.email) {
            this.errors.push('Você precisa preencher pelo menos um contato');
        }
    }

    isValidPhoneNumber(phoneNumber) {
        const phoneRegex = /^[\d\s\+\-()]{7,15}$/;
        return phoneRegex.test(phoneNumber);
    }

    isValidId(id) {
        return typeof id === 'string';
    }

    static async buscaPorId(id) {
        if (!this.isValidId(id)) return null;
        return await ContatoModel.findById(id);
    }

    static async buscaContatos() {
        return await ContatoModel.find().sort({ criadoEm: -1 });
    }

    static async delete(id) {
        if (!this.isValidId(id)) return null;
        return await ContatoModel.findOneAndDelete({ _id: id });
    }

    static isValidId(id) {
        return typeof id === 'string';
    }
}

module.exports = Contato;
