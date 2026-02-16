import dataServiceMock from "./dataServiceMock";
import {JsonSchema} from "@jsonforms/core";
export default class ContinuumUIExtensionService {

    constructor(
            private name: String,
            private data: any,
            private dataSchema: JsonSchema,
            private uiSchema: any,
            private onDataChange: ({errors, data}: {errors:Array<any>, data:any}) => void = () => {}
    ) {
    }

    callNodeDataService(params) {
        console.log("callNodeDataService called");
        const rpcRequest = JSON.parse(params.dataServiceRequest);
        const result = dataServiceMock(rpcRequest);
        return new Promise((resolve) =>
                setTimeout(() => resolve({ result: { result } }), 500),
        );
    }

    addPushEventListener() {
        console.log(`Push event listener added for event ${name}`);
        return () => {};
    }

    getConfig() {
        return {
            initialData: {
                "result": {
                    "name": this.name,
                    "data": this.data,
                    "schema": this.dataSchema,
                    "ui_schema": this.uiSchema,
                    "flowVariableSettings": {}
                }
            },
            nodeId: "0",
            workflowId: "0",
            projectId: "7",
            hasNodeView: false,
            extensionType: "dialog",
            renderingConfig: {
                type: "DEFAULT",
            }
        };
    }

    getResourceLocation() {
        console.log("getResourceLocation called");
        return Promise.resolve("Dummy resource location");
    }

    imageGenerated() {
        console.log("imageGenerated called");
    }

    publishData(data: any) {
        console.log("publishData called with", data);
        this.onDataChange({
            errors: [],
            data: data.data
        });
    }

    sendAlert(alert) {
        console.log("alert sent: ", alert);
    }

    setReportingContent() {
        console.log("setReportingContent called");
    }

    onApplied() {
        console.log("onApplied called");
    }

    onDirtyStateChange(dirtyState) {
        console.log("onDirtyStateChange called with", dirtyState);
    }

    updateDataPointSelection() {
        console.log("updateDataPointSelection called");
        return Promise.resolve();
    }

    setControlsVisibility(param) {
        console.log("setControlsVisibility called with", param);
        return Promise.resolve();
    }

    showDataValueView(config) {
        console.log("showDataValueView called with", config);
    }

    closeDataValueView() {
        console.log("closeDataValueView called");
    }
}