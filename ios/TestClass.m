//
//  TestClass.m
//  MyTestApp
//
//  Created by Jeremy Massel on 2019-10-17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "TestClass.h"

@implementation TestClass

-(void) doNativeException:(NSString *)name {
  [NSException raise:@"This is a native exception" format: name];
}

-(void) doNativeCrash {
  [self performSelector:@selector(crash_here_please)];
}

@end
