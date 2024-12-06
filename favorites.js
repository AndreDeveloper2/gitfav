export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`
    return fetch(endpoint)
    .then(data => data.json())
    .then(({login,name,public_repos,followers}) => ({
      login,
      name,
      public_repos,
      followers
    }))
  }
}

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load () {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    
    try {
      
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists){
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)
      if(user.login === undefined){
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    this.entries = this.entries.filter(entry => entry.login !== user.login)
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')
    
    this.update()
    this.onadd()
  }

  onadd() {
    const addbutton = this.root.querySelector('.addbtn')
    addbutton.onclick = () => {
      const { value } = this.root.querySelector('.search')
      this.add(value)
      const input = this.root.querySelector('.search')
      input.value = ''
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `https://github.com/${user.login}`

      row.querySelector('.name').textContent = `${user.name}`
      row.querySelector('.username').textContent = `${user.login}`
      row.querySelector('.username').href = `https://github.com/${user.login}`

      row.querySelector('.public_repos').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.delete').addEventListener('click', () => {
        const isOk = confirm('Tem certeza que deseja deletar esse usuário ?')

        if(isOk) {
          this.delete(user)
        }
      })

      this.tbody.append(row)

    })    
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.className = "border-b-[#4A808C] border-b flex odd:bg-[#030B0D] even:bg-[#06181C] justify-between text-center pl-10 py-6 pr-6"

    tr.innerHTML = `
      <td class="flex gap-4 w-[31rem] user">
        <img class="w-14 h-14 rounded-full" src="https://github.com/maykbrito.png" alt="">
        <div class="text-left">
          <p class="text-xl font-bold text-white name">Maykbrito</p>
          <a href="https://github.com/diego3g" class="text-xl hover:overline text-white username">/maykbrito</a>
        </div>
      </td>
      <td class="w-56 text-xl text-white public_repos">123</td>
      <td class="w-[14rem] text-xl text-white followers">1234</td>
      <td class="w-44">
        <button class=" delete text-xl text-[#F75A68] hover:scale-110">
          Remover
        </button>
    </td
    `

    return tr
  }

  removeAllTr() {
    
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}