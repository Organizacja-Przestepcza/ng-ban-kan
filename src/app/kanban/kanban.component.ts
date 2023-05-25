import { Component, Inject } from '@angular/core';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent {
  constructor(public dialog: Dialog) {}
  localData() {
    let taskList: Array<TaskT>;
    let json = localStorage.getItem('localArray');
    if (json !== null) {
      taskList = JSON.parse(json);
    } else taskList = [];
    return taskList;
  }
  taskList: Array<TaskT> = this.localData();
  localId() {
    var localId: number;
    let json = localStorage.getItem('localId');
    if (json !== null) {
      localId = JSON.parse(json);
    } else localId = 1;
    return localId;
  }
  newTask: string = '';
  nextId: number = this.localId();
  addTask() {
    if (this.newTask != '') {
      console.log('Task #' + this.nextId + ' added');
      let newDate = new Date();
      let date = formatDate(newDate,'dd.MM.y, HH:mm:ss','en-US');
      this.taskList.push({
        id: this.nextId,
        content: this.newTask,
        addDate: newDate,
        addDateString: date,
        startDateString: 'not started yet',
        completeDateString: 'not completed yet',
        status: 0,
      });
      this.newTask = '';
      this.nextId++;
      localStorage.setItem('localId', JSON.stringify(this.nextId));
      console.log(this.taskList);
      localStorage.setItem('localArray', JSON.stringify(this.taskList));
    }
  }
  startTask(id: number) {
    console.log('Task #' + id + ' started');
    let index: number = this.taskList.findIndex((e) => e.id == id);
    let newDate = new Date();
    let date = formatDate(newDate,'dd.MM.y, HH:mm:ss','en-US');
    this.taskList[index].status = 1;
    this.taskList[index].startDate = newDate;
    this.taskList[index].startDateString = date;
    localStorage.setItem('localArray', JSON.stringify(this.taskList));
  }
  completeTask(id: number) {
    console.log('Task #' + id + ' completed');
    let index: number = this.taskList.findIndex((e) => e.id == id);
    let newDate = new Date();
    let date = formatDate(newDate,'dd.MM.y, HH:mm:ss','en-US');
    this.taskList[index].status = 2;
    this.taskList[index].completeDate = newDate;
    this.taskList[index].completeDateString = date;
    localStorage.setItem('localArray', JSON.stringify(this.taskList));
  }
  removeTask(id: number) {
    console.log('Task #' + id + ' removed');
    this.taskList = this.taskList.filter((e) => e.id != id);
    localStorage.setItem('localArray', JSON.stringify(this.taskList));
  }
  drop(event: CdkDragDrop<TaskT[]>) {
    console.log(event);
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    if (event.container.id == 'list1') {
      let id = event.item.data.id;
      this.startTask(id);
    }
    if (event.container.id == 'list2') {
      let id = event.item.data.id;
      this.completeTask(id);
    }
  }
  openTask(id: number) {
    let index = this.taskList.findIndex((e) => e.id == id);
    this.dialog.open(KanbanTaskDialog, {
      data: this.taskList[index],
    });
  }
}

export type TaskT = {
  id: number;
  content: string;
  addDate: Date;
  addDateString?: string;
  startDate?: Date;
  startDateString?: string;
  completeDate?: Date;
  completeDateString?: string;
  status: number; // 0 - not started ; 1 - in-progress ; 2 - completed
};

@Component({
  selector: 'app-kanban-taskdialog',
  templateUrl: 'kanban-taskdialog.html',
  styleUrls: ['kanban-taskdialog.css']
})
export class KanbanTaskDialog {
  constructor(@Inject(DIALOG_DATA) public data: TaskT) {}
  task: TaskT = this.data;
}
