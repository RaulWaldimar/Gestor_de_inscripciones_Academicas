import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css']
})
export class CursosComponent {

  courseForm: FormGroup;
  cursos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    this.courseForm = this.fb.group({
      nombre: ['', Validators.required],
      docente: ['', Validators.required],
      horario: ['', Validators.required],
      cupos: ['', Validators.required],
      semestre: ['', Validators.required]
    });

    this.courseService.getCourses().subscribe(data => {
      this.cursos = data;
    });
  }

  crearCurso() {
    if (this.courseForm.invalid) return;

    this.courseService.addCourse(this.courseForm.value);
    this.courseForm.reset();
  }
}
