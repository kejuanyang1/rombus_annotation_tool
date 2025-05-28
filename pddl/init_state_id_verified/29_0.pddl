(define (problem generated)
  (:domain manip)
  (:objects
    container_05 container_06 - container
    office_02 office_07 - item
  )
  (:init
    (clear office_02)
    (clear office_07)
    (handempty)
    (ontable container_05)
    (ontable container_06)
    (ontable office_02)
    (ontable office_07)
  )
  (:goal (and))
)
