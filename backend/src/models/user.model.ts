
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { User } from '../types/user'

class UserModel {
  private users: User[] = []

  // Create user
  async create(newUser: Omit<User, 'id'>) {
    const { username, password, firstname, lastname } = newUser
    const foundIndex = this.users.findIndex(
      u => u.username.toLowerCase() === username.toLowerCase()
    )
    if (foundIndex !== -1) return false
    const hashedPassword = await bcrypt.hash(password, 12)
    this.users.push({
      id: uuidv4(),
      username,
      password: hashedPassword,
      firstname,
      lastname
    })
    return true
  }

  // Check user
  async login(details: Partial<User>) {
    const { username, password } = details
    const found = this.users.find(u => u.username.toLowerCase() === username?.toLowerCase())
    console.log(this.users)
    if (!found) return false
    if(!password) return false

    
    const isMatch = await bcrypt.compare(password, found.password)
    console.log(isMatch)
    if (!isMatch) return false
    return found
  }

  // Get user data
  findByUsername(username: string) {
    const user = this.users.find(u => u.username === username)
    if (!user) return false
    return user
  }
}

export default new UserModel