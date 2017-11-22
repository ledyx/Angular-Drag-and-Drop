import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  items: Array<string> = ['a', 'b', 'c', 'd', 'e'];

  sourceTarget: EventTarget = null;
  destTargetData: string = null;

  public onDragStart(event: DragEvent) {
    this.sourceTarget = event.target;

    const data = this.wrapData(event);

    event.dataTransfer.setData('text/plain', data);
    event.dataTransfer.dropEffect = 'move';
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    //event.dataTransfer.dropEffect = 'move';
  }

  public onDragEnter(event: DragEvent) {
    this.destTargetData = this.wrapData(event);

    // 첫 클릭한 아이템은 효과를 적용할 필요가 없음.
    if(this.sourceTarget != event.target)
      (event.target as HTMLElement).style.backgroundColor = "pink";
  }

  public onDragLeave(event: DragEvent) {
    this.destTargetData = null;

    (event.target as HTMLElement).style.backgroundColor = "cyan";
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();

    const sourceData = this.unwrapData(event.dataTransfer.getData('text'));
    const targetData = this.unwrapData(this.destTargetData);

    this.moveIndex(sourceData.index, targetData.index);

    (event.target as HTMLElement).style.backgroundColor = "cyan";
  }

  public onDrop2(event: DragEvent) {
    event.preventDefault();

    //const sourceData = this.unwrapData(event.dataTransfer.getData('text'));

    (event.target as HTMLElement).innerHTML = event.dataTransfer.getData('text');
  }

  private wrapData(event: Event): string {
    const index = (event.target as HTMLElement).getAttribute('data-index');
    return JSON.stringify({
      'type' : 'list',
      'index' : parseInt(index)
    });
  }

  private unwrapData(jsonString: string): any {
    return JSON.parse(jsonString);
  }

  private moveIndex(sourceIndex: number, destIndex: number) {
    if((sourceIndex === destIndex) || (sourceIndex < 0) || (destIndex < 0))
      return;

    //remove
    const temp = this.items.splice(sourceIndex, 1);

    //insert
    this.items.splice(destIndex, 0, temp[0]);
  }
}
