import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type TicketModel = runtime.Types.Result.DefaultSelection<Prisma.$TicketPayload>;
export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null;
    _min: TicketMinAggregateOutputType | null;
    _max: TicketMaxAggregateOutputType | null;
};
export type TicketMinAggregateOutputType = {
    id: string | null;
    code: string | null;
    status: $Enums.Status | null;
    createdAt: Date | null;
    calledAt: Date | null;
    finishedAt: Date | null;
};
export type TicketMaxAggregateOutputType = {
    id: string | null;
    code: string | null;
    status: $Enums.Status | null;
    createdAt: Date | null;
    calledAt: Date | null;
    finishedAt: Date | null;
};
export type TicketCountAggregateOutputType = {
    id: number;
    code: number;
    status: number;
    createdAt: number;
    calledAt: number;
    finishedAt: number;
    _all: number;
};
export type TicketMinAggregateInputType = {
    id?: true;
    code?: true;
    status?: true;
    createdAt?: true;
    calledAt?: true;
    finishedAt?: true;
};
export type TicketMaxAggregateInputType = {
    id?: true;
    code?: true;
    status?: true;
    createdAt?: true;
    calledAt?: true;
    finishedAt?: true;
};
export type TicketCountAggregateInputType = {
    id?: true;
    code?: true;
    status?: true;
    createdAt?: true;
    calledAt?: true;
    finishedAt?: true;
    _all?: true;
};
export type TicketAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[];
    cursor?: Prisma.TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TicketCountAggregateInputType;
    _min?: TicketMinAggregateInputType;
    _max?: TicketMaxAggregateInputType;
};
export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
    [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTicket[P]> : Prisma.GetScalarType<T[P], AggregateTicket[P]>;
};
export type TicketGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithAggregationInput | Prisma.TicketOrderByWithAggregationInput[];
    by: Prisma.TicketScalarFieldEnum[] | Prisma.TicketScalarFieldEnum;
    having?: Prisma.TicketScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TicketCountAggregateInputType | true;
    _min?: TicketMinAggregateInputType;
    _max?: TicketMaxAggregateInputType;
};
export type TicketGroupByOutputType = {
    id: string;
    code: string;
    status: $Enums.Status;
    createdAt: Date;
    calledAt: Date | null;
    finishedAt: Date | null;
    _count: TicketCountAggregateOutputType | null;
    _min: TicketMinAggregateOutputType | null;
    _max: TicketMaxAggregateOutputType | null;
};
type GetTicketGroupByPayload<T extends TicketGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TicketGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TicketGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TicketGroupByOutputType[P]>;
}>>;
export type TicketWhereInput = {
    AND?: Prisma.TicketWhereInput | Prisma.TicketWhereInput[];
    OR?: Prisma.TicketWhereInput[];
    NOT?: Prisma.TicketWhereInput | Prisma.TicketWhereInput[];
    id?: Prisma.StringFilter<"Ticket"> | string;
    code?: Prisma.StringFilter<"Ticket"> | string;
    status?: Prisma.EnumStatusFilter<"Ticket"> | $Enums.Status;
    createdAt?: Prisma.DateTimeFilter<"Ticket"> | Date | string;
    calledAt?: Prisma.DateTimeNullableFilter<"Ticket"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableFilter<"Ticket"> | Date | string | null;
};
export type TicketOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    calledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    finishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type TicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.TicketWhereInput | Prisma.TicketWhereInput[];
    OR?: Prisma.TicketWhereInput[];
    NOT?: Prisma.TicketWhereInput | Prisma.TicketWhereInput[];
    status?: Prisma.EnumStatusFilter<"Ticket"> | $Enums.Status;
    createdAt?: Prisma.DateTimeFilter<"Ticket"> | Date | string;
    calledAt?: Prisma.DateTimeNullableFilter<"Ticket"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableFilter<"Ticket"> | Date | string | null;
}, "id" | "code">;
export type TicketOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    calledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    finishedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TicketCountOrderByAggregateInput;
    _max?: Prisma.TicketMaxOrderByAggregateInput;
    _min?: Prisma.TicketMinOrderByAggregateInput;
};
export type TicketScalarWhereWithAggregatesInput = {
    AND?: Prisma.TicketScalarWhereWithAggregatesInput | Prisma.TicketScalarWhereWithAggregatesInput[];
    OR?: Prisma.TicketScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TicketScalarWhereWithAggregatesInput | Prisma.TicketScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Ticket"> | string;
    code?: Prisma.StringWithAggregatesFilter<"Ticket"> | string;
    status?: Prisma.EnumStatusWithAggregatesFilter<"Ticket"> | $Enums.Status;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Ticket"> | Date | string;
    calledAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null;
    finishedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Ticket"> | Date | string | null;
};
export type TicketCreateInput = {
    id?: string;
    code: string;
    status?: $Enums.Status;
    createdAt?: Date | string;
    calledAt?: Date | string | null;
    finishedAt?: Date | string | null;
};
export type TicketUncheckedCreateInput = {
    id?: string;
    code: string;
    status?: $Enums.Status;
    createdAt?: Date | string;
    calledAt?: Date | string | null;
    finishedAt?: Date | string | null;
};
export type TicketUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    calledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TicketUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    calledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TicketCreateManyInput = {
    id?: string;
    code: string;
    status?: $Enums.Status;
    createdAt?: Date | string;
    calledAt?: Date | string | null;
    finishedAt?: Date | string | null;
};
export type TicketUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    calledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TicketUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    calledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    finishedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TicketCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    calledAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
};
export type TicketMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    calledAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
};
export type TicketMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    calledAt?: Prisma.SortOrder;
    finishedAt?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type EnumStatusFieldUpdateOperationsInput = {
    set?: $Enums.Status;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type TicketSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    status?: boolean;
    createdAt?: boolean;
    calledAt?: boolean;
    finishedAt?: boolean;
}, ExtArgs["result"]["ticket"]>;
export type TicketSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    status?: boolean;
    createdAt?: boolean;
    calledAt?: boolean;
    finishedAt?: boolean;
}, ExtArgs["result"]["ticket"]>;
export type TicketSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    status?: boolean;
    createdAt?: boolean;
    calledAt?: boolean;
    finishedAt?: boolean;
}, ExtArgs["result"]["ticket"]>;
export type TicketSelectScalar = {
    id?: boolean;
    code?: boolean;
    status?: boolean;
    createdAt?: boolean;
    calledAt?: boolean;
    finishedAt?: boolean;
};
export type TicketOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "status" | "createdAt" | "calledAt" | "finishedAt", ExtArgs["result"]["ticket"]>;
export type $TicketPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Ticket";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        code: string;
        status: $Enums.Status;
        createdAt: Date;
        calledAt: Date | null;
        finishedAt: Date | null;
    }, ExtArgs["result"]["ticket"]>;
    composites: {};
};
export type TicketGetPayload<S extends boolean | null | undefined | TicketDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TicketPayload, S>;
export type TicketCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TicketCountAggregateInputType | true;
};
export interface TicketDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Ticket'];
        meta: {
            name: 'Ticket';
        };
    };
    findUnique<T extends TicketFindUniqueArgs>(args: Prisma.SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TicketFindFirstArgs>(args?: Prisma.SelectSubset<T, TicketFindFirstArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TicketFindManyArgs>(args?: Prisma.SelectSubset<T, TicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TicketCreateArgs>(args: Prisma.SelectSubset<T, TicketCreateArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TicketCreateManyArgs>(args?: Prisma.SelectSubset<T, TicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TicketCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TicketDeleteArgs>(args: Prisma.SelectSubset<T, TicketDeleteArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TicketUpdateArgs>(args: Prisma.SelectSubset<T, TicketUpdateArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TicketDeleteManyArgs>(args?: Prisma.SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TicketUpdateManyArgs>(args: Prisma.SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TicketUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TicketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TicketUpsertArgs>(args: Prisma.SelectSubset<T, TicketUpsertArgs<ExtArgs>>): Prisma.Prisma__TicketClient<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TicketCountArgs>(args?: Prisma.Subset<T, TicketCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TicketCountAggregateOutputType> : number>;
    aggregate<T extends TicketAggregateArgs>(args: Prisma.Subset<T, TicketAggregateArgs>): Prisma.PrismaPromise<GetTicketAggregateType<T>>;
    groupBy<T extends TicketGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TicketGroupByArgs['orderBy'];
    } : {
        orderBy?: TicketGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TicketFieldRefs;
}
export interface Prisma__TicketClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TicketFieldRefs {
    readonly id: Prisma.FieldRef<"Ticket", 'String'>;
    readonly code: Prisma.FieldRef<"Ticket", 'String'>;
    readonly status: Prisma.FieldRef<"Ticket", 'Status'>;
    readonly createdAt: Prisma.FieldRef<"Ticket", 'DateTime'>;
    readonly calledAt: Prisma.FieldRef<"Ticket", 'DateTime'>;
    readonly finishedAt: Prisma.FieldRef<"Ticket", 'DateTime'>;
}
export type TicketFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    where: Prisma.TicketWhereUniqueInput;
};
export type TicketFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    where: Prisma.TicketWhereUniqueInput;
};
export type TicketFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[];
    cursor?: Prisma.TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TicketScalarFieldEnum | Prisma.TicketScalarFieldEnum[];
};
export type TicketFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[];
    cursor?: Prisma.TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TicketScalarFieldEnum | Prisma.TicketScalarFieldEnum[];
};
export type TicketFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[];
    cursor?: Prisma.TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TicketScalarFieldEnum | Prisma.TicketScalarFieldEnum[];
};
export type TicketCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TicketCreateInput, Prisma.TicketUncheckedCreateInput>;
};
export type TicketCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TicketCreateManyInput | Prisma.TicketCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TicketCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    data: Prisma.TicketCreateManyInput | Prisma.TicketCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TicketUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TicketUpdateInput, Prisma.TicketUncheckedUpdateInput>;
    where: Prisma.TicketWhereUniqueInput;
};
export type TicketUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TicketUpdateManyMutationInput, Prisma.TicketUncheckedUpdateManyInput>;
    where?: Prisma.TicketWhereInput;
    limit?: number;
};
export type TicketUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TicketUpdateManyMutationInput, Prisma.TicketUncheckedUpdateManyInput>;
    where?: Prisma.TicketWhereInput;
    limit?: number;
};
export type TicketUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    where: Prisma.TicketWhereUniqueInput;
    create: Prisma.XOR<Prisma.TicketCreateInput, Prisma.TicketUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TicketUpdateInput, Prisma.TicketUncheckedUpdateInput>;
};
export type TicketDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    where: Prisma.TicketWhereUniqueInput;
};
export type TicketDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
    limit?: number;
};
export type TicketDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TicketSelect<ExtArgs> | null;
    omit?: Prisma.TicketOmit<ExtArgs> | null;
};
export {};
