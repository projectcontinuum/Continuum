/* eslint-disable camelcase */
/* eslint-disable complexity */
import type { Result } from "knime-core-ui/src/nodeDialog/api/types/Result";
import type { IndicesValuePairs, UpdateResult } from "knime-core-ui/src/nodeDialog/types/Update";
import type { PreviewResult } from "knime-core-ui/src/nodeDialog/uiComponents/fileChooser/composables/useFileFilterPreviewBackend";

const errorFolder = "Open me to see an error message!";

const scope_A = "#/properties/view/properties/a";
const scope_updatedByA = "#/properties/view/properties/updatedByA";
const scope_A_nested =
        "#/properties/view/properties/myArray/items/properties/a";
const scope_A_nested_nested =
        "#/properties/view/properties/myArray/items/properties/nestedArray/items/properties/a";
const scope_B = "#/properties/view/properties/b";
const scope_updatedByB = "#/properties/view/properties/updatedByB";
const scope_B_nested =
        "#/properties/view/properties/myArray/items/properties/b";
const scope_B_nested_nested =
        "#/properties/view/properties/myArray/items/properties/nestedArray/items/properties/b";

const scope_title =
        "#/properties/view/properties/dummyArrayLayout/items/properties/title";
const scope_subTitle =
        "#/properties/view/properties/dummyArrayLayout/items/properties/subTitle";

const scope_title_textMessage = "#/properties/title";
const scope_description_textMessage = "#/properties/description";
const scope_type_textMessage = "#/properties/type";
const scope_show_textMessage = "#/properties/show";

const mockUpdate2 = (rpcRequest: {
    method: string;
    params: any[];
}): Result<UpdateResult[]> => {
    if (rpcRequest.params[1].id === "ElementResetButton") {
        return {
            state: "SUCCESS",
            result: [
                {
                    scope:
                            "#/properties/view/properties/dummyArrayLayout/items/properties/doubleInput",
                    values: [{ indices: [], value: 0 }],
                },
                {
                    scope:
                            "#/properties/view/properties/dummyArrayLayout/items/properties/stringInput",
                    values: [{ indices: [], value: "" }],
                },
                {
                    scope:
                            "#/properties/view/properties/dummyArrayLayout/items/properties/radioInput",
                    values: [{ indices: [], value: "OPTION1" }],
                },
            ],
        };
    }
    if (
            rpcRequest.params[1].id ===
            "buttonTriggerId (from simpleButtonControl.json)"
    ) {
        window.alert("Button was clicked!");
        return { state: "CANCELED" };
    }
    const dependencies = rpcRequest.params[2] as Record<
            string,
            IndicesValuePairs
    >;
    /**
     * See textMessage.json
     */
    if (Object.keys(dependencies).includes(scope_title_textMessage)) {
        const {
            [scope_title_textMessage]: [{ value: title }],
            [scope_description_textMessage]: [{ value: description }],
            [scope_type_textMessage]: [{ value: type }],
            [scope_show_textMessage]: [{ value: show }],
        } = rpcRequest.params[2];
        return {
            state: "SUCCESS",
            result: [
                {
                    id: "textMessageId",
                    providedOptionName: "message",
                    values: [
                        {
                            indices: [],
                            value: show
                                    ? {
                                        type,
                                        title,
                                        description,
                                    }
                                    : null,
                        },
                    ],
                },
            ],
        };
    }

    /**
     * See update.json
     */
    if (Object.keys(dependencies).includes(scope_updatedByA)) {
        const {
            [scope_updatedByA]: [{ value: UpdatedByA }],
        } = dependencies;
        return {
            state: "SUCCESS",
            result: [
                {
                    scope: "#/properties/view/properties/updatedByUpdatedByA",

                    values: [{ indices: [], value: UpdatedByA }],
                },
            ],
        } satisfies Result<UpdateResult[]>;
    }
    if (Object.keys(dependencies).includes(scope_updatedByB)) {
        const {
            [scope_updatedByB]: [{ value: UpdatedByB }],
        } = dependencies;
        return {
            state: "SUCCESS",
            result: [
                {
                    scope: "#/properties/view/properties/updatedByUpdatedByB",

                    values: [{ indices: [], value: UpdatedByB }],
                },
            ],
        } satisfies Result<UpdateResult[]>;
    }
    if (Object.keys(dependencies).includes(scope_A)) {
        const {
            [scope_A]: [{ value: A }],
            [scope_B]: [{ value: B }],
        } = dependencies;
        return {
            state: "SUCCESS",
            result: [
                {
                    scope: "#/properties/view/properties/sum",

                    // @ts-expect-error
                    values: [{ indices: [], value: A + B }],
                },
                {
                    scope: "#/properties/view/properties/product",

                    // @ts-expect-error
                    values: [{ indices: [], value: A * B }],
                },
                {
                    scope: "#/properties/view/properties/updatedByA",

                    values: [{ indices: [], value: A }],
                },
            ],
        } satisfies Result<UpdateResult[]>;
    } else if (Object.keys(dependencies).includes(scope_B)) {
        return {
            state: "SUCCESS",
            result: [
                {
                    scope: "#/properties/view/properties/updatedByB",

                    values: [{ indices: [], value: dependencies[scope_B][0].value }],
                },
            ],
        } satisfies Result<UpdateResult[]>;
    } else if (Object.keys(dependencies).includes(scope_A_nested)) {
        /**
         * See updatesInArray.json
         */
        const {
            [scope_A_nested]: [{ value: A_nested }],
            [scope_B_nested]: [{ value: B_nested }],
        } = dependencies;
        return {
            state: "SUCCESS",
            result: [
                {
                    scope: "#/properties/view/properties/myArray/items/properties/sum",
                    values: [
                        {
                            indices: [],
                            // @ts-expect-error
                            value: A_nested + B_nested,
                        },
                    ],
                },
                {
                    scope:
                            "#/properties/view/properties/myArray/items/properties/product",

                    values: [
                        {
                            indices: [],
                            // @ts-expect-error
                            value: `A * B ${A_nested * B_nested}`,
                        },
                    ],
                },
                {
                    scope:
                            "#/properties/view/properties/myArray/items/properties/product",
                    providedOptionName: "possibleValues",
                    values: [
                        {
                            indices: [],
                            value: [
                                {
                                    id: `A ${A_nested}`,
                                    text: `A (${A_nested})`,
                                },
                                {
                                    id: `B ${B_nested}`,
                                    text: `B (${B_nested})`,
                                },
                                {
                                    // @ts-expect-error
                                    id: `A * B ${A_nested * B_nested}`,
                                    // @ts-expect-error
                                    text: `A * B (${A_nested * B_nested})`,
                                },
                            ],
                        },
                    ],
                },
            ],
        } satisfies Result<UpdateResult[]>;
    } else if (
            Object.keys(dependencies).includes(scope_title) &&
            Object.keys(dependencies).includes(scope_subTitle)
    ) {
        return {
            state: "SUCCESS",
            result: [
                {
                    scope: "#/properties/view/properties/dummyArrayLayout",
                    providedOptionName: "arrayElementTitle",
                    values: dependencies[scope_title],
                },
                {
                    scope: "#/properties/view/properties/dummyArrayLayout",
                    providedOptionName: "elementSubTitle",
                    values: dependencies[scope_subTitle],
                },
            ],
        };
    } else if (
            Object.keys(dependencies).includes(scope_A_nested_nested) &&
            Object.keys(dependencies).includes(scope_B_nested_nested)
    ) {
        const {
            [scope_A_nested_nested]: [{ value: A_nested_nested }],
            [scope_B_nested_nested]: [{ value: B_nested_nested }],
        } = dependencies;
        /**
         * See updatesInArray.json
         */
        return {
            state: "SUCCESS",
            result: [
                {
                    scope:
                            "#/properties/view/properties/myArray/items/properties/nestedArray/items/properties/sum",

                    values: [
                        {
                            indices: [],
                            // @ts-expect-error
                            value: A_nested_nested + B_nested_nested,
                        },
                    ],
                },
                {
                    scope:
                            "#/properties/view/properties/myArray/items/properties/nestedArray/items/properties/product",

                    values: [
                        {
                            indices: [],
                            // @ts-expect-error
                            value: `A * B ${A_nested_nested * B_nested_nested}`,
                        },
                    ],
                },
                {
                    scope:
                            "#/properties/view/properties/myArray/items/properties/nestedArray/items/properties/product",
                    providedOptionName: "possibleValues",
                    values: [
                        {
                            indices: [],
                            value: [
                                {
                                    id: `A ${A_nested_nested}`,
                                    text: `A (${A_nested_nested})`,
                                },
                                {
                                    id: `B ${B_nested_nested}`,
                                    text: `B (${B_nested_nested})`,
                                },
                                {
                                    // @ts-expect-error
                                    id: `A * B ${A_nested_nested * B_nested_nested}`,
                                    // @ts-expect-error
                                    text: `A * B (${A_nested_nested * B_nested_nested})`,
                                },
                            ],
                        },
                    ],
                },
            ],
        } satisfies Result<UpdateResult[]>;
    } else {
        window.alert(
                "This should not happen: Unhandled data service mock update call",
        );
        throw new Error("Unhandled data service mock update call");
    }
};

const mockFileFilterPreview = (rpcRequest: {
    method: string;
    params: any[];
}): PreviewResult => {
    const folder = rpcRequest.params[1] as string;
    if (folder.includes("error")) {
        return {
            resultType: "ERROR",
            errorMessage: "I am an error message",
        };
    }
    if (folder.includes("empty")) {
        return {
            resultType: "SUCCESS",
            itemsAfterFiltering: [],
            numFilesAfterFilteringIsOnlyLowerBound: false,
            numFilesBeforeFilteringIsOnlyLowerBound: false,
            numItemsBeforeFiltering: 0,
        };
    }
    const includeSubFolders = rpcRequest.params[2];
    const filterValue =
            rpcRequest.params[3].additionalFilterOptions.someFilterValue;
    return {
        resultType: "SUCCESS",
        itemsAfterFiltering: [
            ...(includeSubFolders ? ["some/path/to/file1.txt"] : []),
            "file2.txt",
        ].filter((item) => item.includes(filterValue)),
        numFilesAfterFilteringIsOnlyLowerBound: false,
        numFilesBeforeFilteringIsOnlyLowerBound: includeSubFolders,
        numItemsBeforeFiltering: includeSubFolders ? 1000 : 1,
    };
};

export default (rpcRequest: { method: string; params: any[] }) => {
    switch (rpcRequest.method) {
        case "flowVariables.getAvailableFlowVariables":
            return {
                STRING: [
                    {
                        name: "stringVariable",
                        value: "the string flow variable value (abbrevia...",
                        abbreviated: true,
                    },
                    {
                        name: "nullVariable",
                        value: null,
                        abbreviated: false,
                    },
                ],
                BOOLEAN: [
                    { name: "booleanVariable", value: "true", abbreviated: false },
                ],
                CREDENTIALS: [
                    {
                        name: "credentialsVariable",
                        value: "Credentials (...)",
                        abbreviated: false,
                    },
                ],
                NUMBER: [{ name: "numberVariable", value: "100", abbreviated: false }],
            };
        case "settings.update2": {
            return mockUpdate2(rpcRequest);
        }
        case "flowVariables.getFlowVariableOverrideValue":
            switch (
                    JSON.parse(rpcRequest.params[0]).flowVariableSettings[
                            rpcRequest.params[1].join(".")
                            ].controllingFlowVariableName
                    ) {
                case "stringVariable":
                    return "some string";
                case "booleanVariable":
                    return true;
                case "nullVariable":
                    return null;
                case "numberVariable":
                    return 100;
                case "credentialsVariable":
                    return {
                        username: "Hello",
                        isHiddenPassword: true,
                    };
                default:
                    return "someValue";
            }
        case "settings.getChoices":
            if (rpcRequest.params[0] === "successfulChoicesProvider") {
                return {
                    result: [
                        {
                            id: "NONE",
                            text: "None",
                        },
                        {
                            id: "COUNT",
                            text: "Occurrence count",
                        },
                        {
                            id: "SUM",
                            text: "Sum",
                        },
                        {
                            id: "AVG",
                            text: "Average",
                        },
                    ],
                    state: "SUCCESS",
                };
            } else {
                return {
                    state: "FAIL",
                    message: ["Async choices fetching failed because xyz"],
                };
            }
        case "fileChooser.listItems":
            return {
                folder: {
                    items: [
                        {
                            isDirectory: true,
                            name: "I am a directory",
                        },
                        {
                            isDirectory: true,
                            name: errorFolder,
                        },
                        {
                            isDirectory: false,
                            name: "I am a file, select me!",
                        },
                    ],
                    path: "/path/to/folder",
                    parentFolders: [
                        {
                            path: null,
                            name: null,
                        },
                        {
                            path: "/",
                            name: null,
                        },
                        {
                            path: "/path",
                            name: "path",
                        },
                        {
                            path: "/path/to",
                            name: "to",
                        },
                        {
                            path: "/path/to/folder",
                            name: "folder",
                        },
                    ],
                },
                ...(rpcRequest.params[2] === errorFolder
                        ? { errorMessage: "I am an error message" }
                        : {}),
            };
        case "fileChooser.getFilePath":
            if ((rpcRequest.params[2] as string).includes("path/to/folder/")) {
                return {
                    path: rpcRequest.params[2],
                };
            }
            return { path: `path/to/folder/${rpcRequest.params[2]}` };
        case "fileFilterPreview.listItemsForPreview":
            return mockFileFilterPreview(rpcRequest);

        case "settings.performExternalValidation":
            return {
                result:
                        rpcRequest.params[1] === "MM/DD/YYYY"
                                ? null
                                : "The only valid format is: MM/DD/YYYY",
                state: "SUCCESS",
            };
        default:
            return null;
    }
};
