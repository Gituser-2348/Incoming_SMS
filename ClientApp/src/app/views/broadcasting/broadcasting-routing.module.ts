import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BulkpushComponent } from './bulkpush/bulkpush.component';
import { TemplateComponent } from './template/template.component';
const routes: Routes = [
    {
        path: '',
        data: {
            title: 'broadcast'
        },
        children: [
            {
                path: '',
                redirectTo: 'broadcast'
            },
            {
                path: 'broadcast',
                component: BulkpushComponent,
                data: {
                    title: 'broadcast'
                }
            },
            {
                path: 'template',
                component: TemplateComponent,
                data: {
                    title: 'template'
                }
            },
        ]
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BroadcastRoutingModule { }
