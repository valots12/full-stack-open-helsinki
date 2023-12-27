const Course = ({course}) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
      </div>
    )
  }
  
  const Header = ({ course }) => <h1>{course}</h1>
  
  const Total = ({ sum }) => <p> <strong>Total of {sum} exercises</strong> </p>
  
  const Part = ({ part }) => 
    <p>
      {part.name} {part.exercises}
    </p>
  
  const Content = ({ parts }) => {
    return parts.map(part => <Part key={part.id} part={part} />);
  }

  export default Course