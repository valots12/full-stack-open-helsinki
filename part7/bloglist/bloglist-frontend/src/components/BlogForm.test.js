import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Dave',
  url: 'test.html',
  likes: 6,
  user: { username: 'valots' }
}

let mockCreateBlog = jest.fn()
let user = userEvent.setup()

beforeEach(() => {
  user = userEvent.setup()
  mockCreateBlog = jest.fn()
  render(<BlogForm createBlog={mockCreateBlog} />)
})

describe('part5.16', () => {
  test('Blog form render the new details when a new blog is created', async () => {
    const inputs = screen.getAllByRole('textbox')
    const button = screen.getByText('create')

    await user.type(inputs[0], blog.title)
    await user.type(inputs[1], blog.author)
    await user.type(inputs[2], blog.url)
    await user.click(button)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    console.log(mockCreateBlog.mock.calls[0])
    expect(mockCreateBlog.mock.calls[0][0].title).toBe(blog.title)
    expect(mockCreateBlog.mock.calls[0][0].author).toBe(blog.author)
    expect(mockCreateBlog.mock.calls[0][0].url).toBe(blog.url)
  })
})
