class Course {
    constructor(title, instructor, image) {
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
}

class UI {
    addCourseToList(course) {
        const list = document.getElementById('course-list');

        const html = `
        <tr>
        <td><img src="img/${course.image}" /></td>
        <td>${course.title}</td>
        <td>${course.instructor}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
        </tr>
        `;

        list.innerHTML += html;
    }

    clearControls() {
        document.getElementById('title').value = '';
        document.getElementById('instructor').value = '';
        document.getElementById('image').value = '';
    }

    deleteCourse(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    showAlert(msg, className) {
        const alert = `
        <div class="alert alert-${className}">
        ${msg}
        </div>
        `;

        const row = document.querySelector('.row');
        row.insertAdjacentHTML('afterEnd', alert);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }
}

class Store {
    static getCourses() {
        let courses;
        if (localStorage.getItem('courses') === null) {
            courses = [];
        } else {
            courses = JSON.parse(localStorage.getItem('courses'));
        }
        return courses;
    }

    static displayCourses() {
        const courses = Store.getCourses();
        courses.forEach(course => {
            const ui = new UI();
            ui.addCourseToList(course);
        });
    }

    static addCourse(course) {
        const courses = Store.getCourses();
        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    static removeCourse(image) {
        const courses = Store.getCourses();
        const updatedCourses = courses.filter(course => course.image !== image);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Store.displayCourses();
});

document.getElementById('new-course').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;

    const course = new Course(title, instructor, image);
    const ui = new UI();

    if (title === '' || instructor === '' || image === '') {
        ui.showAlert('Please complete the form', 'danger');
    } else {
        ui.addCourseToList(course);
        Store.addCourse(course);
        ui.clearControls();
        ui.showAlert('Course has been added', 'success');
    }
});

document.getElementById('course-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete')) {
        const ui = new UI();
        ui.deleteCourse(e.target);
        const image = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.firstChild.getAttribute('src').split('/')[1];
        Store.removeCourse(image);
        ui.showAlert('Course has been deleted', 'warning');
    }
});
