#include "network.h"

int main(int argc,char *argv[]){
   clock_t start_time, end_time;
   start_time=clock();
   //freopen("newdata.txt","r",stdin);
   //freopen("summary.txt","w",stdout);
   Network nw=Network();
   JSONcontext* ctx;
   if (argc>=2){
      ctx=nw.readJSON(argv[1]);
   } else {
      abort();
   }   
   nw.dump();
   double _force=nw.layout();
   end_time=clock();
   double dif=difftime(end_time,start_time);
   printf("time used: %0.3lf seconds\n\n",dif/1000);
   if (argc>=3){
      nw.writeJSON(ctx,argv[2]);
   } else {
      nw.dumpNodes("summary.txt");
      nw.dumpNodes((char*) 0 );
   }
   return 0;
}
