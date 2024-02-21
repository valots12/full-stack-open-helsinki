import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Dave',
  url: 'test.html',
  likes: 6,
  user: { username: 'valots' }
}

let mockUpdateBlog = jest.fn()
let mockDeleteBlog = jest.fn()

beforeEach(() => {
  mockUpdateBlog = jest.fn()
  mockDeleteBlog = jest.fn()
  render(<Blog blog={blog} updatedBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} />)
})

describe('part5.13', () => {
  test('Render title and author', () => {
    const element = screen.getByText('Component testing is done with react-testing-library - Dave')
    expect(element).toBeDefined()
  })
})

describe('part5.14', () => {
  test('Render url and likes', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    // const elementUrl = screen.getByText('test.html')
    // expect(elementUrl).toBeDefined()

    const elementLikes = screen.getByText(6)
    expect(elementLikes).toBeDefined()
  })
})