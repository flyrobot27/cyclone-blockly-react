
class BlockNames {
    static MainBlock = class {
        static Type = "main_block";
        static ProcessName = "PROCESS_NAME";;
        static LengthOfRun = "length_of_run";
        static NoOfCycles = "no_of_cycles";
        static NetworkInput = "network_input";
    }

    static CombiInputStatement = class {
        static Type = "combi_input_statement";
        static Label = "label_c";
        static SetNumber = "set_number";
        static Description = "DESCRIPTION";
        static Followers = "followers";
        static Preceders = "precedeers";
    }

    static NormalTaskInput = class {
        static Type = "normal_task_input";
        static Label = "label_n";
        static SetNumber = "set_number";
        static Description = "DESCRIPTION";
        static Followers = "followers";
    }

    static QueueInputStatement = class {
        static Type = "queue_input_statement";
        static Label = "label_q";
        static Description = "DESCRIPTION";
        static NumberToBeGenerated = "number_to_be_generated";
        static ResourceInput = "resource_input";
    }

    static FunctionConsolidateInput = class {
        static Type = "function_consolidate_input";
        static Label = "label_fn";
        static NumberToConsolidate = "number_to_consolidate";
        static Followers = "followers";
        static Description = "DESCRIPTION";
    }

    static FunctionCounterInput = class {
        static Type = "function_counter_input";
        static Label = "label_fc";
        static Quantity = "quantity";
        static Followers = "followers";
        static Description = "DESCRIPTION";
    }

    static ResourceInputStatement = class {
        static Type = "resource_input_statement";
        static NoOfUnit = "no_of_unit";
        static Description = "DESCRIPTION";
        static Cost = "cost";
    }

    static VariableCostStatement = class {
        static Type = "variable_cost";
        static VariableCost = "variable_cost";
    }

    static FixedCostStatement = class {
        static Type = "fixed_cost";
        static FixedCost = "fixed_cost";
    }

    static RefStatements = class {
        static Type = class {
            static Queue = "ref_queue";
            static Resource = "ref_resource";
            static Combi = "ref_combi";
            static Normal = "ref_normal";
            static Function = "ref_function";
        }

        static Dropdown = "REF_DROPDOWN";
        static DropdownLabel = "dropdown_labels";
    }

    static StationaryInputConnector = class {
        static Type = "stationary_input_connector";
        static Distribution = "distribution";
    }

    static NonStationaryInputConnector = class {
        static Type = "non_stationary_input_connector";
        static Distribution = "distribution_input";
        static Category = "CATEGORY";
        static CategoryFirst = "FIRST";
        static CategorySecond = "SECOND";
        static Increment = "increment";
        static CategoryInput = "category_dummy";
        static RealizationNumber = "realization_number";
        static Seed = "seed";
        static RealizationNumberText = "realization_number_text";
        static SeedText = "seed_text";
    }

    static Distribution = class {
        static Type = "distribution";
        static Distribution = "DISTRIBUTION";
        static ParametersInput = "parameters_input";

        static Deterministic = class {
            static Type = "deterministic";
            static ConstantField = "CONSTANT";
            static Constant = "constant";
        }

        static Exponential = class {
            static Type = "exponential";
            static MeanField = "MEAN";
            static Mean = "mean";
        };
        static Uniform = class {
            static Type = "uniform";
            static LowField = "LOW";
            static HighField = "HIGH";
            static Low = "low";
            static High = "high";
        };
        static Normal = class {
            static Type = "normal";
            static MeanField = "MEAN";
            static VarianceField = "VARIANCE";
            static Mean = "mean";
            static Variance = "variance";
        };

        static Triangular = class {
            static Type = "triangular";
            static LowField = "LOW";
            static ModeField = "MODE";
            static HighField = "HIGH";
            static Low = "low";
            static Mode = "mode";
            static High = "high";
        };

        static Lognormal = class {
            static Type = "lognormal";
            static LowField = "LOW";
            static ScaleField = "SCALE";
            static ShapeField = "SHAPE";
            static Low = "low";
            static Scale = "scale";
            static Shape = "shape";
        };

        static Beta = class {
            static Type = "beta";
            static LowField = "LOW";
            static HighField = "HIGH";
            static Shape1Field = "SHAPE1";
            static Shape2Field = "SHAPE2";
            static Low = "low";
            static High = "high";
            static Shape1 = "shape1";
            static Shape2 = "shape2";
        };
    }

    static Description = class {
        static Type = "description";
        static Description = "DESCRIPTION";
    }
}

export default BlockNames;
