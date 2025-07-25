import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlowlandingComponent } from './flowlanding/flowlanding.component';
import { FlowBuilderComponent } from './flowbuilder.component';
import { FlowPreviewComponent } from './flowPreview/flowPreview.component';
const routes: Routes = [
  {
    path: '',
    component: FlowlandingComponent,
    data: {
      title: 'Flow'
    }
  },
  {
    path: 'flow',
    component: FlowBuilderComponent,
    data: {
      title: 'Flow'
    }
  },
  {
    path: 'flowpreview',
    component: FlowPreviewComponent,
    data: {
      title: 'Flow'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowbuilderRoutingModule { }
