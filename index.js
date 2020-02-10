let InputForm = {
    template: `<div style="width: 100%; position: relative">
<textarea @keyup.enter="createNote" wrap="hard" type="text" v-model="input" placeholder="New note" style="padding-right: 50px"></textarea>
<span v-if="input" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%)">{{ input.trim().split(' ').length > 1 ? input.trim().split(' ').length + ' words' : input.trim().split(' ').length + ' word' }}</span></div>`,
    data() {
        return {
            input: ''
        }
    },
    props: ["notes"],
    methods: {
        createNote() {
            if (this.input.trim() != '') {
                console.log(this.notes)
                this.notes.unshift({input: this.input, id: new Date().getTime(), words: this.input.trim().split(' ').length, editing: false, beforeEdit: this.input})
                this.$emit('get-notes', this.notes)
                localStorage.setItem('notes', JSON.stringify(this.notes))
                this.input = ''
            }
        }
    }
}

let Notes = {
    props: ['notes'],
    template: `<div style="position: relative; word-break: break-all; text-align: center">
<div style="display: flex; justify-content: flex-end; height: 10%">
<p @click="$emit('delete')" style="cursor: pointer">&#10060;</p>
</div>
<div style="padding: 40px 10px; border-top: 0.5px solid lightgrey; text-align: start; position: relative">
<small style="position: absolute; top: 10px; left: 10px; color: grey; font-size: 9px">Double click on the text to change it and press enter to send.</small>
<p @dblclick="$emit('edit')" style="display: initial; cursor: pointer" v-if="notes.editing == false">{{ notes.input }}</p>
<textarea v-model="notes.input" style="height: 100%; outline-color: #8F4DF8; border: 0.5px solid #8F4DF8" v-focus @blur="$emit('edit'), $emit('done')" @keyup.enter="$emit('done')" @keyup.esc="$emit('cancel')" v-else>{{ notes.input }}</textarea>
</div>
<div style="height: 10%; position:absolute;bottom: 0; width: 100%; display: flex; justify-content: center; align-items: center; border-top: 0.5px solid lightgrey">
<span v-if="notes.editing == false">{{ notes.words > 1 ? notes.words + ' words' : notes.words + ' word' }}</span>
<span v-else>Is typing...</span>
</div>
</div>`
}

let app = new Vue({
    el: "#app",
    data: {
        input: '',
        notes: []
    },
    mounted() {
        if (localStorage.getItem('notes') != null)
            this.notes = JSON.parse(localStorage.getItem('notes'))
    },
    components: {
        InputForm,
        Notes
    },
    methods: {
        getNotes(notes) {
            this.notes = notes
        },
        editNote(note, index) {
            note.editing = !note.editing
            localStorage.setItem('notes', JSON.stringify(this.notes))
        },
        deleteNote(id) {
            this.notes.splice(id, 1)
            localStorage.setItem('notes', JSON.stringify(this.notes))
        },
        doneNote(note, index) {
            if (note.input.trim() == '') {
                note.input = note.beforeEdit
            }

            note.beforeEdit = note.input
            note.words = note.input.trim().split(' ').length
            note.editing = false
            localStorage.setItem('notes', JSON.stringify(this.notes))
        },
        cancelEdit(note) {
            console.log(note.beforeEdit)
            note.input = note.beforeEdit
            note.editing = false
        }
    }
})
Vue.directive('focus', {
    // Quand l'élément lié est inséré dans le DOM...
    inserted: function (el) {
        // L'élément prend le focus
        el.focus()
    }
})
