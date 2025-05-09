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
    (ontable scrapper)
    (ontable tweezers)
    (ontable pointed chisel)
    (ontable yellow basket)
    (clear screwdriver)
    (clear scrapper)
    (clear tweezers)
    (clear pointed chisel)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)