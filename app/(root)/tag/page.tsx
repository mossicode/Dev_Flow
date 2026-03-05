import { getTags } from '../../../lib/action/tag.action';
import { RouteParams } from '../../../types/global';
import LocalSearch from '../../../components/search/LocalSearch';
import DataRender from '../../../components/DataRender';
import { EMPTY_TAGS } from '../../../constants/states';
import TagCard from '../../../components/card/TagCard';
import CommonFilter from '../../../components/filter/common-filter';
import { TagFilters } from '../../../constants/filters';
import Pagination from '../../../components/paginate/pagination';
// import { techDescriptions } from '../../../lib/utils';
import {getTechDescription} from "../../../lib/utils"

async function page({searchParams}:RouteParams) {
  const {page, pageSize, query, filter}= await searchParams;
  const parsedPage = Number(page);
  const parsedPageSize = Number(pageSize);
  const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safePageSize = Number.isFinite(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : 10;

  const {success, data, error}=await getTags({page:safePage, pageSize:safePageSize, query, filter})
  const tags = data?.tags ?? [];
  const isNext = Boolean(data?.isNext);
  return (
    <>
    <h1 className='mt-0'>Tags</h1>
    <section className='mt-10 flex flex-col gap-4 sm:flex-row sm:items-center'>
       <LocalSearch 
          route={'/tags'}
          imgSrc='/home'
          placeholder='Searh by tag name...'
          otherClasses='flex-1'
       />
       <CommonFilter filters={TagFilters} />
    </section>
      <DataRender 
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
      >
        <div className='flex mt-6 gap-3 flex-wrap justify-between'>
          {tags.map((tag)=>(
            <TagCard key={tag._id} {...tag} compact />
          ))}
        </div>
      </DataRender>
      <Pagination page={safePage} isNext={isNext} containerClasses='mt-6' />
    </>
  )
}

export default page
