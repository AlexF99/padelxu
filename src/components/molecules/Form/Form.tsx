import { ComponentProps } from 'react';

import {
    FieldValues, FormProvider, UseFormReturn,
} from 'react-hook-form';

interface FormProps<T extends FieldValues> extends ComponentProps<'form'> {
    form: UseFormReturn<T>;
    children: React.ReactNode;
    isLoading?: boolean;
    fieldsetStyle?: React.CSSProperties;
}

export const Form = <T extends FieldValues>({
    form,
    children,
    isLoading,
    fieldsetStyle = {},
    ...props
}: FormProps<T>) => {
    return (
        <>
            {form ?
                <FormProvider {...form}>
                    <form
                        noValidate
                        {...props}
                    >
                        <fieldset
                            disabled={isLoading}
                            style={{ border: 'none' }}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        >
                            {children}
                        </fieldset>
                    </form>
                </FormProvider>
                :
                children
            }
        </>

    );
};
