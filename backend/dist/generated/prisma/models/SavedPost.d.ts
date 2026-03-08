import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SavedPostModel = runtime.Types.Result.DefaultSelection<Prisma.$SavedPostPayload>;
export type AggregateSavedPost = {
    _count: SavedPostCountAggregateOutputType | null;
    _min: SavedPostMinAggregateOutputType | null;
    _max: SavedPostMaxAggregateOutputType | null;
};
export type SavedPostMinAggregateOutputType = {
    userId: string | null;
    postId: string | null;
    createdAt: Date | null;
};
export type SavedPostMaxAggregateOutputType = {
    userId: string | null;
    postId: string | null;
    createdAt: Date | null;
};
export type SavedPostCountAggregateOutputType = {
    userId: number;
    postId: number;
    createdAt: number;
    _all: number;
};
export type SavedPostMinAggregateInputType = {
    userId?: true;
    postId?: true;
    createdAt?: true;
};
export type SavedPostMaxAggregateInputType = {
    userId?: true;
    postId?: true;
    createdAt?: true;
};
export type SavedPostCountAggregateInputType = {
    userId?: true;
    postId?: true;
    createdAt?: true;
    _all?: true;
};
export type SavedPostAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedPostWhereInput;
    orderBy?: Prisma.SavedPostOrderByWithRelationInput | Prisma.SavedPostOrderByWithRelationInput[];
    cursor?: Prisma.SavedPostWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SavedPostCountAggregateInputType;
    _min?: SavedPostMinAggregateInputType;
    _max?: SavedPostMaxAggregateInputType;
};
export type GetSavedPostAggregateType<T extends SavedPostAggregateArgs> = {
    [P in keyof T & keyof AggregateSavedPost]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSavedPost[P]> : Prisma.GetScalarType<T[P], AggregateSavedPost[P]>;
};
export type SavedPostGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedPostWhereInput;
    orderBy?: Prisma.SavedPostOrderByWithAggregationInput | Prisma.SavedPostOrderByWithAggregationInput[];
    by: Prisma.SavedPostScalarFieldEnum[] | Prisma.SavedPostScalarFieldEnum;
    having?: Prisma.SavedPostScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SavedPostCountAggregateInputType | true;
    _min?: SavedPostMinAggregateInputType;
    _max?: SavedPostMaxAggregateInputType;
};
export type SavedPostGroupByOutputType = {
    userId: string;
    postId: string;
    createdAt: Date;
    _count: SavedPostCountAggregateOutputType | null;
    _min: SavedPostMinAggregateOutputType | null;
    _max: SavedPostMaxAggregateOutputType | null;
};
type GetSavedPostGroupByPayload<T extends SavedPostGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SavedPostGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SavedPostGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SavedPostGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SavedPostGroupByOutputType[P]>;
}>>;
export type SavedPostWhereInput = {
    AND?: Prisma.SavedPostWhereInput | Prisma.SavedPostWhereInput[];
    OR?: Prisma.SavedPostWhereInput[];
    NOT?: Prisma.SavedPostWhereInput | Prisma.SavedPostWhereInput[];
    userId?: Prisma.StringFilter<"SavedPost"> | string;
    postId?: Prisma.StringFilter<"SavedPost"> | string;
    createdAt?: Prisma.DateTimeFilter<"SavedPost"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    post?: Prisma.XOR<Prisma.PostScalarRelationFilter, Prisma.PostWhereInput>;
};
export type SavedPostOrderByWithRelationInput = {
    userId?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    post?: Prisma.PostOrderByWithRelationInput;
};
export type SavedPostWhereUniqueInput = Prisma.AtLeast<{
    userId_postId?: Prisma.SavedPostUserIdPostIdCompoundUniqueInput;
    AND?: Prisma.SavedPostWhereInput | Prisma.SavedPostWhereInput[];
    OR?: Prisma.SavedPostWhereInput[];
    NOT?: Prisma.SavedPostWhereInput | Prisma.SavedPostWhereInput[];
    userId?: Prisma.StringFilter<"SavedPost"> | string;
    postId?: Prisma.StringFilter<"SavedPost"> | string;
    createdAt?: Prisma.DateTimeFilter<"SavedPost"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    post?: Prisma.XOR<Prisma.PostScalarRelationFilter, Prisma.PostWhereInput>;
}, "userId_postId">;
export type SavedPostOrderByWithAggregationInput = {
    userId?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SavedPostCountOrderByAggregateInput;
    _max?: Prisma.SavedPostMaxOrderByAggregateInput;
    _min?: Prisma.SavedPostMinOrderByAggregateInput;
};
export type SavedPostScalarWhereWithAggregatesInput = {
    AND?: Prisma.SavedPostScalarWhereWithAggregatesInput | Prisma.SavedPostScalarWhereWithAggregatesInput[];
    OR?: Prisma.SavedPostScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SavedPostScalarWhereWithAggregatesInput | Prisma.SavedPostScalarWhereWithAggregatesInput[];
    userId?: Prisma.StringWithAggregatesFilter<"SavedPost"> | string;
    postId?: Prisma.StringWithAggregatesFilter<"SavedPost"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SavedPost"> | Date | string;
};
export type SavedPostCreateInput = {
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavedPostsInput;
    post: Prisma.PostCreateNestedOneWithoutSavedByInput;
};
export type SavedPostUncheckedCreateInput = {
    userId: string;
    postId: string;
    createdAt?: Date | string;
};
export type SavedPostUpdateInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavedPostsNestedInput;
    post?: Prisma.PostUpdateOneRequiredWithoutSavedByNestedInput;
};
export type SavedPostUncheckedUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedPostCreateManyInput = {
    userId: string;
    postId: string;
    createdAt?: Date | string;
};
export type SavedPostUpdateManyMutationInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedPostUncheckedUpdateManyInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedPostListRelationFilter = {
    every?: Prisma.SavedPostWhereInput;
    some?: Prisma.SavedPostWhereInput;
    none?: Prisma.SavedPostWhereInput;
};
export type SavedPostOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SavedPostUserIdPostIdCompoundUniqueInput = {
    userId: string;
    postId: string;
};
export type SavedPostCountOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavedPostMaxOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavedPostMinOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    postId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavedPostCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavedPostCreateWithoutUserInput, Prisma.SavedPostUncheckedCreateWithoutUserInput> | Prisma.SavedPostCreateWithoutUserInput[] | Prisma.SavedPostUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedPostCreateOrConnectWithoutUserInput | Prisma.SavedPostCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavedPostCreateManyUserInputEnvelope;
    connect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
};
export type SavedPostUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavedPostCreateWithoutUserInput, Prisma.SavedPostUncheckedCreateWithoutUserInput> | Prisma.SavedPostCreateWithoutUserInput[] | Prisma.SavedPostUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedPostCreateOrConnectWithoutUserInput | Prisma.SavedPostCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavedPostCreateManyUserInputEnvelope;
    connect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
};
export type SavedPostUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavedPostCreateWithoutUserInput, Prisma.SavedPostUncheckedCreateWithoutUserInput> | Prisma.SavedPostCreateWithoutUserInput[] | Prisma.SavedPostUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedPostCreateOrConnectWithoutUserInput | Prisma.SavedPostCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavedPostUpsertWithWhereUniqueWithoutUserInput | Prisma.SavedPostUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavedPostCreateManyUserInputEnvelope;
    set?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    disconnect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    delete?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    connect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    update?: Prisma.SavedPostUpdateWithWhereUniqueWithoutUserInput | Prisma.SavedPostUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavedPostUpdateManyWithWhereWithoutUserInput | Prisma.SavedPostUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavedPostScalarWhereInput | Prisma.SavedPostScalarWhereInput[];
};
export type SavedPostUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavedPostCreateWithoutUserInput, Prisma.SavedPostUncheckedCreateWithoutUserInput> | Prisma.SavedPostCreateWithoutUserInput[] | Prisma.SavedPostUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavedPostCreateOrConnectWithoutUserInput | Prisma.SavedPostCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavedPostUpsertWithWhereUniqueWithoutUserInput | Prisma.SavedPostUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavedPostCreateManyUserInputEnvelope;
    set?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    disconnect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    delete?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    connect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    update?: Prisma.SavedPostUpdateWithWhereUniqueWithoutUserInput | Prisma.SavedPostUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavedPostUpdateManyWithWhereWithoutUserInput | Prisma.SavedPostUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavedPostScalarWhereInput | Prisma.SavedPostScalarWhereInput[];
};
export type SavedPostCreateNestedManyWithoutPostInput = {
    create?: Prisma.XOR<Prisma.SavedPostCreateWithoutPostInput, Prisma.SavedPostUncheckedCreateWithoutPostInput> | Prisma.SavedPostCreateWithoutPostInput[] | Prisma.SavedPostUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.SavedPostCreateOrConnectWithoutPostInput | Prisma.SavedPostCreateOrConnectWithoutPostInput[];
    createMany?: Prisma.SavedPostCreateManyPostInputEnvelope;
    connect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
};
export type SavedPostUncheckedCreateNestedManyWithoutPostInput = {
    create?: Prisma.XOR<Prisma.SavedPostCreateWithoutPostInput, Prisma.SavedPostUncheckedCreateWithoutPostInput> | Prisma.SavedPostCreateWithoutPostInput[] | Prisma.SavedPostUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.SavedPostCreateOrConnectWithoutPostInput | Prisma.SavedPostCreateOrConnectWithoutPostInput[];
    createMany?: Prisma.SavedPostCreateManyPostInputEnvelope;
    connect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
};
export type SavedPostUpdateManyWithoutPostNestedInput = {
    create?: Prisma.XOR<Prisma.SavedPostCreateWithoutPostInput, Prisma.SavedPostUncheckedCreateWithoutPostInput> | Prisma.SavedPostCreateWithoutPostInput[] | Prisma.SavedPostUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.SavedPostCreateOrConnectWithoutPostInput | Prisma.SavedPostCreateOrConnectWithoutPostInput[];
    upsert?: Prisma.SavedPostUpsertWithWhereUniqueWithoutPostInput | Prisma.SavedPostUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: Prisma.SavedPostCreateManyPostInputEnvelope;
    set?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    disconnect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    delete?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    connect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    update?: Prisma.SavedPostUpdateWithWhereUniqueWithoutPostInput | Prisma.SavedPostUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?: Prisma.SavedPostUpdateManyWithWhereWithoutPostInput | Prisma.SavedPostUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: Prisma.SavedPostScalarWhereInput | Prisma.SavedPostScalarWhereInput[];
};
export type SavedPostUncheckedUpdateManyWithoutPostNestedInput = {
    create?: Prisma.XOR<Prisma.SavedPostCreateWithoutPostInput, Prisma.SavedPostUncheckedCreateWithoutPostInput> | Prisma.SavedPostCreateWithoutPostInput[] | Prisma.SavedPostUncheckedCreateWithoutPostInput[];
    connectOrCreate?: Prisma.SavedPostCreateOrConnectWithoutPostInput | Prisma.SavedPostCreateOrConnectWithoutPostInput[];
    upsert?: Prisma.SavedPostUpsertWithWhereUniqueWithoutPostInput | Prisma.SavedPostUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: Prisma.SavedPostCreateManyPostInputEnvelope;
    set?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    disconnect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    delete?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    connect?: Prisma.SavedPostWhereUniqueInput | Prisma.SavedPostWhereUniqueInput[];
    update?: Prisma.SavedPostUpdateWithWhereUniqueWithoutPostInput | Prisma.SavedPostUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?: Prisma.SavedPostUpdateManyWithWhereWithoutPostInput | Prisma.SavedPostUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: Prisma.SavedPostScalarWhereInput | Prisma.SavedPostScalarWhereInput[];
};
export type SavedPostCreateWithoutUserInput = {
    createdAt?: Date | string;
    post: Prisma.PostCreateNestedOneWithoutSavedByInput;
};
export type SavedPostUncheckedCreateWithoutUserInput = {
    postId: string;
    createdAt?: Date | string;
};
export type SavedPostCreateOrConnectWithoutUserInput = {
    where: Prisma.SavedPostWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedPostCreateWithoutUserInput, Prisma.SavedPostUncheckedCreateWithoutUserInput>;
};
export type SavedPostCreateManyUserInputEnvelope = {
    data: Prisma.SavedPostCreateManyUserInput | Prisma.SavedPostCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SavedPostUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavedPostWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavedPostUpdateWithoutUserInput, Prisma.SavedPostUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SavedPostCreateWithoutUserInput, Prisma.SavedPostUncheckedCreateWithoutUserInput>;
};
export type SavedPostUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavedPostWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavedPostUpdateWithoutUserInput, Prisma.SavedPostUncheckedUpdateWithoutUserInput>;
};
export type SavedPostUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SavedPostScalarWhereInput;
    data: Prisma.XOR<Prisma.SavedPostUpdateManyMutationInput, Prisma.SavedPostUncheckedUpdateManyWithoutUserInput>;
};
export type SavedPostScalarWhereInput = {
    AND?: Prisma.SavedPostScalarWhereInput | Prisma.SavedPostScalarWhereInput[];
    OR?: Prisma.SavedPostScalarWhereInput[];
    NOT?: Prisma.SavedPostScalarWhereInput | Prisma.SavedPostScalarWhereInput[];
    userId?: Prisma.StringFilter<"SavedPost"> | string;
    postId?: Prisma.StringFilter<"SavedPost"> | string;
    createdAt?: Prisma.DateTimeFilter<"SavedPost"> | Date | string;
};
export type SavedPostCreateWithoutPostInput = {
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavedPostsInput;
};
export type SavedPostUncheckedCreateWithoutPostInput = {
    userId: string;
    createdAt?: Date | string;
};
export type SavedPostCreateOrConnectWithoutPostInput = {
    where: Prisma.SavedPostWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedPostCreateWithoutPostInput, Prisma.SavedPostUncheckedCreateWithoutPostInput>;
};
export type SavedPostCreateManyPostInputEnvelope = {
    data: Prisma.SavedPostCreateManyPostInput | Prisma.SavedPostCreateManyPostInput[];
    skipDuplicates?: boolean;
};
export type SavedPostUpsertWithWhereUniqueWithoutPostInput = {
    where: Prisma.SavedPostWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavedPostUpdateWithoutPostInput, Prisma.SavedPostUncheckedUpdateWithoutPostInput>;
    create: Prisma.XOR<Prisma.SavedPostCreateWithoutPostInput, Prisma.SavedPostUncheckedCreateWithoutPostInput>;
};
export type SavedPostUpdateWithWhereUniqueWithoutPostInput = {
    where: Prisma.SavedPostWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavedPostUpdateWithoutPostInput, Prisma.SavedPostUncheckedUpdateWithoutPostInput>;
};
export type SavedPostUpdateManyWithWhereWithoutPostInput = {
    where: Prisma.SavedPostScalarWhereInput;
    data: Prisma.XOR<Prisma.SavedPostUpdateManyMutationInput, Prisma.SavedPostUncheckedUpdateManyWithoutPostInput>;
};
export type SavedPostCreateManyUserInput = {
    postId: string;
    createdAt?: Date | string;
};
export type SavedPostUpdateWithoutUserInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    post?: Prisma.PostUpdateOneRequiredWithoutSavedByNestedInput;
};
export type SavedPostUncheckedUpdateWithoutUserInput = {
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedPostUncheckedUpdateManyWithoutUserInput = {
    postId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedPostCreateManyPostInput = {
    userId: string;
    createdAt?: Date | string;
};
export type SavedPostUpdateWithoutPostInput = {
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavedPostsNestedInput;
};
export type SavedPostUncheckedUpdateWithoutPostInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedPostUncheckedUpdateManyWithoutPostInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavedPostSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    postId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedPost"]>;
export type SavedPostSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    postId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedPost"]>;
export type SavedPostSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    postId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savedPost"]>;
export type SavedPostSelectScalar = {
    userId?: boolean;
    postId?: boolean;
    createdAt?: boolean;
};
export type SavedPostOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"userId" | "postId" | "createdAt", ExtArgs["result"]["savedPost"]>;
export type SavedPostInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
};
export type SavedPostIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
};
export type SavedPostIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    post?: boolean | Prisma.PostDefaultArgs<ExtArgs>;
};
export type $SavedPostPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SavedPost";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        post: Prisma.$PostPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        userId: string;
        postId: string;
        createdAt: Date;
    }, ExtArgs["result"]["savedPost"]>;
    composites: {};
};
export type SavedPostGetPayload<S extends boolean | null | undefined | SavedPostDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SavedPostPayload, S>;
export type SavedPostCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SavedPostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SavedPostCountAggregateInputType | true;
};
export interface SavedPostDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SavedPost'];
        meta: {
            name: 'SavedPost';
        };
    };
    findUnique<T extends SavedPostFindUniqueArgs>(args: Prisma.SelectSubset<T, SavedPostFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SavedPostClient<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SavedPostFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SavedPostFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavedPostClient<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SavedPostFindFirstArgs>(args?: Prisma.SelectSubset<T, SavedPostFindFirstArgs<ExtArgs>>): Prisma.Prisma__SavedPostClient<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SavedPostFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SavedPostFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavedPostClient<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SavedPostFindManyArgs>(args?: Prisma.SelectSubset<T, SavedPostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SavedPostCreateArgs>(args: Prisma.SelectSubset<T, SavedPostCreateArgs<ExtArgs>>): Prisma.Prisma__SavedPostClient<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SavedPostCreateManyArgs>(args?: Prisma.SelectSubset<T, SavedPostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SavedPostCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SavedPostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SavedPostDeleteArgs>(args: Prisma.SelectSubset<T, SavedPostDeleteArgs<ExtArgs>>): Prisma.Prisma__SavedPostClient<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SavedPostUpdateArgs>(args: Prisma.SelectSubset<T, SavedPostUpdateArgs<ExtArgs>>): Prisma.Prisma__SavedPostClient<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SavedPostDeleteManyArgs>(args?: Prisma.SelectSubset<T, SavedPostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SavedPostUpdateManyArgs>(args: Prisma.SelectSubset<T, SavedPostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SavedPostUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SavedPostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SavedPostUpsertArgs>(args: Prisma.SelectSubset<T, SavedPostUpsertArgs<ExtArgs>>): Prisma.Prisma__SavedPostClient<runtime.Types.Result.GetResult<Prisma.$SavedPostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SavedPostCountArgs>(args?: Prisma.Subset<T, SavedPostCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SavedPostCountAggregateOutputType> : number>;
    aggregate<T extends SavedPostAggregateArgs>(args: Prisma.Subset<T, SavedPostAggregateArgs>): Prisma.PrismaPromise<GetSavedPostAggregateType<T>>;
    groupBy<T extends SavedPostGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SavedPostGroupByArgs['orderBy'];
    } : {
        orderBy?: SavedPostGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SavedPostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SavedPostFieldRefs;
}
export interface Prisma__SavedPostClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    post<T extends Prisma.PostDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PostDefaultArgs<ExtArgs>>): Prisma.Prisma__PostClient<runtime.Types.Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SavedPostFieldRefs {
    readonly userId: Prisma.FieldRef<"SavedPost", 'String'>;
    readonly postId: Prisma.FieldRef<"SavedPost", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SavedPost", 'DateTime'>;
}
export type SavedPostFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    where: Prisma.SavedPostWhereUniqueInput;
};
export type SavedPostFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    where: Prisma.SavedPostWhereUniqueInput;
};
export type SavedPostFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    where?: Prisma.SavedPostWhereInput;
    orderBy?: Prisma.SavedPostOrderByWithRelationInput | Prisma.SavedPostOrderByWithRelationInput[];
    cursor?: Prisma.SavedPostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavedPostScalarFieldEnum | Prisma.SavedPostScalarFieldEnum[];
};
export type SavedPostFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    where?: Prisma.SavedPostWhereInput;
    orderBy?: Prisma.SavedPostOrderByWithRelationInput | Prisma.SavedPostOrderByWithRelationInput[];
    cursor?: Prisma.SavedPostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavedPostScalarFieldEnum | Prisma.SavedPostScalarFieldEnum[];
};
export type SavedPostFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    where?: Prisma.SavedPostWhereInput;
    orderBy?: Prisma.SavedPostOrderByWithRelationInput | Prisma.SavedPostOrderByWithRelationInput[];
    cursor?: Prisma.SavedPostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavedPostScalarFieldEnum | Prisma.SavedPostScalarFieldEnum[];
};
export type SavedPostCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedPostCreateInput, Prisma.SavedPostUncheckedCreateInput>;
};
export type SavedPostCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SavedPostCreateManyInput | Prisma.SavedPostCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SavedPostCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    data: Prisma.SavedPostCreateManyInput | Prisma.SavedPostCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SavedPostIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SavedPostUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedPostUpdateInput, Prisma.SavedPostUncheckedUpdateInput>;
    where: Prisma.SavedPostWhereUniqueInput;
};
export type SavedPostUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SavedPostUpdateManyMutationInput, Prisma.SavedPostUncheckedUpdateManyInput>;
    where?: Prisma.SavedPostWhereInput;
    limit?: number;
};
export type SavedPostUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavedPostUpdateManyMutationInput, Prisma.SavedPostUncheckedUpdateManyInput>;
    where?: Prisma.SavedPostWhereInput;
    limit?: number;
    include?: Prisma.SavedPostIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SavedPostUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    where: Prisma.SavedPostWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavedPostCreateInput, Prisma.SavedPostUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SavedPostUpdateInput, Prisma.SavedPostUncheckedUpdateInput>;
};
export type SavedPostDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
    where: Prisma.SavedPostWhereUniqueInput;
};
export type SavedPostDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavedPostWhereInput;
    limit?: number;
};
export type SavedPostDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavedPostSelect<ExtArgs> | null;
    omit?: Prisma.SavedPostOmit<ExtArgs> | null;
    include?: Prisma.SavedPostInclude<ExtArgs> | null;
};
export {};
