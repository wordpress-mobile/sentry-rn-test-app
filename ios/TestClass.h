//
//  TestClass.h
//  MyTestApp
//
//  Created by Jeremy Massel on 2019-10-17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCT_EXTERN_MODULE(TestClass, NSObject)

RCT_EXTERN_METHOD(doNativeException:(NSString *)name)
RCT_EXTERN_METHOD(doNativeCrash)

@end

NS_ASSUME_NONNULL_END
