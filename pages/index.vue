<template>
    <div class="container">
        <div v-for="user in users">{{ user.name}}</div>
    </div>
</template>

<script type="text/javascript" charset="utf-8">
    export default {
        mounted() {
            fetch('/db.sqlite').then(response => response.arrayBuffer()
                .then(file => this.createDb(file) )
            )
        },
        data() {
            return {
                users: [],
                xusers: [
                    {id: 3, name: 'Lily', email: 'lily@lilyl,com', status: 'active'},
                    {id: 4, name: 'bubbles', email: 'bubbles@lilyl,com', status: 'active'}
                ],
            }
        },
        methods: {
            createDb(sqliteFile) {
                let vm = this
                initSqlJs().then(function (SQL) {
                    let Uints = new Uint8Array(sqliteFile)
                    let db = new SQL.Database(Uints)
                    db.each('SELECT * FROM users', row => vm.users.push(row))
                })
            }

        }
    }
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
}

</style>
