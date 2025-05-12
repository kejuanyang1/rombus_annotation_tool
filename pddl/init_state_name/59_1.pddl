(define (problem scene1)
  (:domain manip)
  (:objects
    screwdriver - item
    scrapper - item
    tweezers - item
    pointed chisel - item
    yellow basket - container
  )
  (:init
    (ontable screwdriver)
    (ontable tweezers)
    (ontable pointed chisel)
    (in scrapper yellow basket)
    (ontable yellow basket)
    (handempty)
    (clear screwdriver)
    (clear tweezers)
    (clear pointed chisel)
  )
  (:goal (and ))
)