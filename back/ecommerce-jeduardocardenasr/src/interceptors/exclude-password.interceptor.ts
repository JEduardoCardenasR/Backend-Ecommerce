// /* eslint-disable @typescript-eslint/no-unused-vars */
// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class ExcludeSensitiveFieldsInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(
//       map((data) => {
//         if (
//           data &&
//           typeof data === 'object' &&
//           data.users &&
//           Array.isArray(data.users)
//         ) {
//           // Si la respuesta es un objeto con un array de usuarios, excluimos `password` y `confirmPassword` de cada usuario
//           return {
//             ...data,
//             users: data.users.map(
//               ({ password, confirmPassword, ...rest }) => rest,
//             ),
//           };
//         } else if (Array.isArray(data)) {
//           // Si la respuesta es un array, excluimos `password` y `confirmPassword` de cada usuario
//           return data.map(({ password, confirmPassword, ...rest }) => rest);
//         } else if (typeof data === 'object' && data !== null) {
//           // Si la respuesta es un objeto único, excluimos `password` y `confirmPassword`
//           const { password, confirmPassword, ...rest } = data;
//           return rest;
//         }
//         return data; // Si la respuesta no es un objeto o array, la dejamos intacta
//       }),
//     );
//   }
// }

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// export function ExcludeFieldsInterceptor(excludedFields: string[]) {
//   @Injectable()
//   class MixinInterceptor implements NestInterceptor {
//     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//       return next.handle().pipe(
//         map((data) => {
//           if (
//             data &&
//             typeof data === 'object' &&
//             data.users &&
//             Array.isArray(data.users)
//           ) {
//             return {
//               ...data,
//               users: data.users.map((user) => {
//                 const filteredUser = { ...user };
//                 excludedFields.forEach((field) => delete filteredUser[field]);
//                 return filteredUser;
//               }),
//             };
//           } else if (Array.isArray(data)) {
//             return data.map((user) => {
//               const filteredUser = { ...user };
//               excludedFields.forEach((field) => delete filteredUser[field]);
//               return filteredUser;
//             });
//           } else if (typeof data === 'object' && data !== null) {
//             const filteredUser = { ...data };
//             excludedFields.forEach((field) => delete filteredUser[field]);
//             return filteredUser;
//           } else if (data.createdUser && typeof data.createdUser === 'object') {
//             return {
//               ...data,
//               createdUser: Object.fromEntries(
//                 Object.entries(data.createdUser).filter(
//                   ([key]) => !excludedFields.includes(key),
//                 ),
//               ),
//             };
//           }
//           return data;
//         }),
//       );
//     }
//   }
//   return mixin(MixinInterceptor);
// }

export function ExcludeFieldsInterceptor(excludedFields: string[]) {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          if (data.createdUser && typeof data.createdUser === 'object') {
            return {
              ...data,
              createdUser: Object.fromEntries(
                Object.entries(data.createdUser).filter(
                  ([key]) => !excludedFields.includes(key),
                ),
              ),
            };
          } else if (
            data &&
            typeof data === 'object' &&
            data.users &&
            Array.isArray(data.users)
          ) {
            return {
              ...data,
              users: data.users.map((user) => {
                const filteredUser = { ...user };
                excludedFields.forEach((field) => delete filteredUser[field]);
                return filteredUser;
              }),
            };
          } else if (Array.isArray(data)) {
            return data.map((user) => {
              const filteredUser = { ...user };
              excludedFields.forEach((field) => delete filteredUser[field]);
              return filteredUser;
            });
          } else if (typeof data === 'object' && data !== null) {
            const filteredUser = { ...data };
            excludedFields.forEach((field) => delete filteredUser[field]);
            return filteredUser;
          }

          return data;
        }),
      );
    }
  }
  return mixin(MixinInterceptor);
}
